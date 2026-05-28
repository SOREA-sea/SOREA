import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2022-11-15' });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { coachId, country = 'FR' } = body;
    if (!coachId) return NextResponse.json({ error: 'coachId required' }, { status: 400 });

    const coach = await prisma.coachProfile.findUnique({ where: { id: Number(coachId) }, include: { user: true } });
    if (!coach) return NextResponse.json({ error: 'Coach not found' }, { status: 404 });

    // Create a connected account
    const account = await stripe.accounts.create({ type: 'express', country, capabilities: { card_payments: { requested: true }, transfers: { requested: true } } });

    // create account link for onboarding
    const accountLink = await stripe.accountLinks.create({ account: account.id, refresh_url: process.env.STRIPE_ONBOARDING_REFRESH_URL || 'https://example.com/refresh', return_url: process.env.STRIPE_ONBOARDING_RETURN_URL || 'https://example.com/return', type: 'account_onboarding' });

    // store stripe account id
    await prisma.coachProfile.update({ where: { id: coach.id }, data: { stripeAccountId: account.id } });

    return NextResponse.json({ url: accountLink.url, accountId: account.id });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
