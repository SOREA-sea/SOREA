import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2022-11-15' });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, items } = body; // items: [{ productId, quantity }]
    if (!userId || !items || !Array.isArray(items) || items.length === 0) return NextResponse.json({ error: 'userId and items required' }, { status: 400 });

    // load products and ensure same supplier
    const productIds = items.map((i: any) => i.productId);
    const products = await prisma.shopProduct.findMany({ where: { id: { in: productIds } } });
    if (products.length !== productIds.length) return NextResponse.json({ error: 'Some products not found' }, { status: 404 });

    const supplierId = products[0].supplierId;
    if (!supplierId) return NextResponse.json({ error: 'Product supplier missing' }, { status: 400 });
    if (products.some(p => p.supplierId !== supplierId)) return NextResponse.json({ error: 'All products must belong to same supplier' }, { status: 400 });

    // compute total
    let totalCents = 0;
    const orderItemsData: any[] = [];
    for (const it of items) {
      const prod = products.find(p => p.id === it.productId)!;
      const qty = Number(it.quantity || 1);
      totalCents += Math.round(prod.price * 100) * qty;
      orderItemsData.push({ productId: prod.id, quantity: qty, unitPrice: prod.price });
    }

    // create order
    const order = await prisma.order.create({ data: { userId: Number(userId), supplierId: supplierId, total: totalCents / 100 } });

    // create order items
    for (const od of orderItemsData) {
      await prisma.orderItem.create({ data: { orderId: order.id, productId: od.productId, quantity: od.quantity, unitPrice: od.unitPrice } });
    }

    // create payment intent
    const paymentIntent = await stripe.paymentIntents.create({ amount: totalCents, currency: 'eur', payment_method_types: ['card'], metadata: { orderId: String(order.id), userId: String(userId) } });

    const payment = await prisma.payment.create({ data: { amount: totalCents / 100, currency: 'EUR', status: 'pending', stripeId: paymentIntent.id, userId: Number(userId), commissionPercentage: 15 } });

    // link payment to order
    await prisma.order.update({ where: { id: order.id }, data: { payment: { connect: { id: payment.id } } } });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret, orderId: order.id });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
