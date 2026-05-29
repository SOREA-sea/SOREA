import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2022-11-15' });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { bookingId } = body;
    if (!bookingId) return NextResponse.json({ error: 'bookingId required' }, { status: 400 });

    const booking = await prisma.sessionBooking.findUnique({
      where: { id: Number(bookingId) },
      include: { session: { include: { coach: { include: { user: true } } } }, user: true },
    });
    if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

    const session = booking.session;
    const coachProfile = session.coach;
    // coach's stripe account id should be stored on coachProfile.user or coachProfile
    // try coachProfile.stripeAccountId
    // @ts-ignore
    const coachStripeAccount = coachProfile.stripeAccountId || coachProfile.user?.stripeAccountId;
    if (!coachStripeAccount) {
      return NextResponse.json({ error: 'Coach has not connected Stripe account' }, { status: 400 });
    }

    const amount = Math.round((session.price || 0) * 100); // cents
    if (amount <= 0) return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });

    // Commission percentage for sessions = 10% or 5% if ambassador
    // @ts-ignore
    const isAmbassador = coachProfile.ambassador === true;
    const commissionPercent = isAmbassador ? 0.05 : 0.10;
    const applicationFee = Math.round(amount * commissionPercent);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'eur',
      payment_method_types: ['card'],
      metadata: { bookingId: String(booking.id), userId: String(booking.userId) },
      // We create a platform-held payment; transfers will be done after confirmations.
    });

    // store payment as pending in DB
    const payment = await prisma.payment.create({
      data: {
        amount: (amount / 100),
        currency: 'EUR',
        status: 'pending',
        stripeId: paymentIntent.id,
        commissionPercentage: commissionPercent * 100,
        userId: booking.userId,
      },
    });

    // link booking -> payment
    await prisma.sessionBooking.update({ where: { id: booking.id }, data: { paymentId: payment.id } });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
