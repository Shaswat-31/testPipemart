import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    // Extract `wordpressId` from the query string
    const url = new URL(req.url);
    const wordpressId = url.searchParams.get('wordpressId');

    if (!wordpressId) {
      return new NextResponse(JSON.stringify({ error: 'wordpressId is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Fetch templates filtered by wordpressId
    const templates = await prisma.templates.findMany({
      where: { wordpressId }, // Use the string directly
    });

    return new NextResponse(JSON.stringify(templates), {
      status: 200,
      headers: { 'Content-Type': 'application/json',"Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0", },
    });
  } catch (error) {
    console.error('Error fetching templates:', error);
    return new NextResponse(JSON.stringify({ error: 'Error fetching templates' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
