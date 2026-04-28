import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function GET(){
  try{
    // there's no dedicated testimonial model in Prisma schema; use static or derive from reviews
    const reviews = await prisma.coachReview.findMany({ take: 6 });
    const mapped = reviews.map(r=>({ author: r.userId.toString(), text: r.reviewText ?? '', id: r.id }));
    return NextResponse.json(mapped);
  }catch(err){
    const seed = [
      { id:1, author:'Alice', text:'Very calming experience, helped my daily routine.' },
      { id:2, author:'Bob', text:'Great guidance and personalized support.' },
      { id:3, author:'Claire', text:'Loved the kits and the short rituals.' }
    ];
    return NextResponse.json(seed);
  }
}
