import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2022-11-15' });

export async function POST(req: Request) {
  const body = await req.text();
  const sig = (req.headers as any).get('stripe-signature') || '';
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  let event: Stripe.Event;
  try {
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } else {
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch (err: any) {
    console.error('Webhook signature verification failed.', err.message);
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object as Stripe.PaymentIntent;
        // find DB payment by stripeId
        const dbPayment = await prisma.payment.findUnique({ where: { stripeId: pi.id } });
        if (dbPayment) {
          await prisma.payment.update({ where: { id: dbPayment.id }, data: { status: 'succeeded' } });
          // if this payment is linked to an order, mark order as paid
          if (dbPayment.orderId) {
            await prisma.order.update({ where: { id: dbPayment.orderId }, data: { status: 'paid' } });
          }
        }
        break;
      }
      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        const piId = charge.payment_intent as string | undefined;
        if (piId) {
          const dbPayment = await prisma.payment.findUnique({ where: { stripeId: piId } });
          if (dbPayment) {
            await prisma.refund.create({ data: { paymentId: dbPayment.id, amount: (charge.amount_refunded || 0) / 100, status: 'processed' } });
            await prisma.payment.update({ where: { id: dbPayment.id }, data: { status: 'refunded' } });
          }
        }
        break;
      }
      case 'charge.dispute.created': {
        const dispute = event.data.object as any;
        const charge = dispute.charge as string | undefined;
        // find payment by charge -> paymentIntent
        // we try to map by charge.payment_intent from Stripe API if available
        break;
      }
      default:
        // ignore
        break;
    }
  } catch (err) {
    console.error('Error handling webhook:', err);
  }

  return NextResponse.json({ received: true });
}
