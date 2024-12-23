import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    // Fetch all items from the database
    const items = await prisma.category.findMany();
    return new Response(JSON.stringify(items), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    return new Response(JSON.stringify({ error: 'Error fetching items' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
