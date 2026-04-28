import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function GET(){
  try{
    const sessions = await prisma.coachSession.findMany({ orderBy: { id: 'asc' } });
    return NextResponse.json(sessions);
  }catch(err){
    const seed = [
      { id:1, title:'Pilates', price:45, imageUrl:'/images/session_1.webp' },
      { id:2, title:'Meditation', price:40, imageUrl:'/images/session_2.webp' },
      { id:3, title:'Yoga', price:50, imageUrl:'/images/session_1.webp' }
    ];
    return NextResponse.json(seed);
  }
}
