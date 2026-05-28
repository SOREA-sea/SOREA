import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, supplierId, trackingNumber } = body;
    if (!orderId || !supplierId) return NextResponse.json({ error: 'orderId and supplierId required' }, { status: 400 });

    const order = await prisma.order.findUnique({ where: { id: Number(orderId) }, include: { supplier: true, payment: true } });
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    if (order.supplierId !== Number(supplierId)) return NextResponse.json({ error: 'Supplier mismatch' }, { status: 403 });

    await prisma.order.update({ where: { id: order.id }, data: { status: 'shipped', trackingNumber: trackingNumber || null } });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
