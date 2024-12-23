import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch all entries from the database
    const entries = await prisma.entry.findMany({
      include: {
        product: true, // Include related product information
        city: true,    // Include related city information
        template: true // Include related template information
      }
    });

    // Return the fetched entries as JSON
    return NextResponse.json(entries, { status: 200 });
  } catch (error) {
    console.error('Error fetching entries:', error);
    return NextResponse.json({ error: 'Failed to fetch entries' }, { status: 500 });
  }
}
