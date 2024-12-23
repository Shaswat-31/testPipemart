import grades from '../main/grades.json';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req) {
    const body = await req.json();
    const {title} = body;
  try {
    const particularGrade=grades[title];
    const grade=particularGrade.links;
    const linkKeys=Object.entries(grade).reduce((acc,curr)=>{
        acc.push(curr[0]);
        return acc;
    },[])
    console.log(linkKeys);
    return NextResponse.json({grade:linkKeys}); // Return the structured result as JSON
  } catch (error) {
    console.error('Error processing grades:', error);
    return NextResponse.json({ error: 'Failed to process grades' }, { status: 500 });
  }
}
