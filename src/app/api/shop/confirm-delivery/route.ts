import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2022-11-15' });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, userId } = body;
    if (!orderId || !userId) return NextResponse.json({ error: 'orderId and userId required' }, { status: 400 });

    const order = await prisma.order.findUnique({ where: { id: Number(orderId) }, include: { supplier: true, payment: true } });
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    if (order.userId !== Number(userId)) return NextResponse.json({ error: 'User mismatch' }, { status: 403 });

    // mark delivered
    await prisma.order.update({ where: { id: order.id }, data: { status: 'delivered' } });

    // release payment to supplier (if payment exists and not yet released)
    if (order.payment && order.payment.status === 'succeeded') {
      const payment = order.payment;
      const totalCents = Math.round(payment.amount * 100);
      const commissionPercent = (payment.commissionPercentage ?? 15) / 100;
      const commissionCents = Math.round(totalCents * commissionPercent);
      const recipientCents = totalCents - commissionCents;

      const supplierStripeAccount = order.supplier.stripeAccountId;
      if (!supplierStripeAccount) return NextResponse.json({ error: 'Supplier Stripe account missing' }, { status: 400 });

      await stripe.transfers.create({ amount: recipientCents, currency: 'eur', destination: supplierStripeAccount });

      await prisma.commission.create({ data: { paymentId: payment.id, platformAmount: commissionCents / 100, recipientAmount: recipientCents / 100, percentage: commissionPercent * 100 } });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
