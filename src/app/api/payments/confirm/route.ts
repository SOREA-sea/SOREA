import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2022-11-15' });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { bookingId, role } = body; // role = 'coach'|'user'
    if (!bookingId || !role) return NextResponse.json({ error: 'bookingId and role required' }, { status: 400 });

    const booking = await prisma.sessionBooking.findUnique({ where: { id: Number(bookingId) }, include: { session: { include: { coach: true } }, payment: true } });
    if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

    const data: any = {};
    if (role === 'coach') data.coachConfirmed = true;
    if (role === 'user') data.userConfirmed = true;

    const updated = await prisma.sessionBooking.update({ where: { id: booking.id }, data });

    // If both confirmed and payment exists and not yet released, do transfer
    if (updated.coachConfirmed && updated.userConfirmed && booking.payment && !updated.paymentReleased) {
      const payment = await prisma.payment.findUnique({ where: { id: booking.payment.id } });
      if (!payment) return NextResponse.json({ error: 'Payment record missing' }, { status: 500 });

      // compute amounts based on stored commissionPercentage (fallback 10%)
      const totalCents = Math.round(payment.amount * 100);
      const commissionPercent = (payment.commissionPercentage ?? 10) / 100;
      const commissionCents = Math.round(totalCents * commissionPercent);
      const recipientCents = totalCents - commissionCents;

      // get coach stripe account
      // @ts-ignore
      const coachStripeAccount = booking.session.coach.stripeAccountId;
      if (!coachStripeAccount) return NextResponse.json({ error: 'Coach Stripe account missing' }, { status: 400 });

      // create transfer from platform balance to connected account
      await stripe.transfers.create({ amount: recipientCents, currency: 'eur', destination: coachStripeAccount });

      // record commission
      await prisma.commission.create({ data: { paymentId: payment.id, platformAmount: commissionCents / 100, recipientAmount: recipientCents / 100, percentage: 10 } });

      // mark payment released
      await prisma.sessionBooking.update({ where: { id: booking.id }, data: { paymentReleased: true } });

    }

    return NextResponse.json({ ok: true, booking: updated });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
