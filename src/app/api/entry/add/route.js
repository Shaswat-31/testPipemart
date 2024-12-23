import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    // Parse the request body
    const { productId, cityId, templateId, status, url } = await req.json();

    // Validate input
    if (!productId || !cityId || !templateId || !url) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create a new entry
    const newEntry = await prisma.entry.create({
      data: {
        productId,
        cityId,
        templateId,
        status: status || 'NOT_PUBLISHED', // Default status if not provided
        url,
      },
    });

    // Send success response
    return NextResponse.json(newEntry, { status: 201 });
  } catch (error) {
    console.error('Error creating entry:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
