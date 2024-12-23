import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const images = await prisma.image.findMany();

    return new Response(JSON.stringify(images), { status: 200 });
  } catch (error) {
    console.error('Error fetching images:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch cities' }), {
      status: 500,
    });
  }
}