import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function GET() {
  try {
    const products = await prisma.shopProduct.findMany({ orderBy: { id: 'asc' } });
    return NextResponse.json(products);
  } catch (err) {
    // fallback static
    const seed = [
      { id: 1, name: 'Relaxation Kit', description: 'Kit for calming moments', price: 29.99, imageUrl: '/images/product_1.webp' },
      { id: 2, name: 'Aroma Candle', description: 'Soothing scent', price: 19.99, imageUrl: '/images/product_2.webp' },
      { id: 3, name: 'Wellness Journal', description: 'Track your habits', price: 24.99, imageUrl: '/images/product_3.webp' }
    ];
    return NextResponse.json(seed);
  }
}
