import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const { title, url, productType } = body;

    // Access the 'sites' model (camelCase is important here)
    const site = await prisma.sites.create({
      data: {
        title,
        url,
        productType,
      },
    });

    return new Response(JSON.stringify(site), { status: 200 });
  } catch (error) {
    console.error('Error inserting data:', error);
    return new Response(JSON.stringify({ error: 'Failed to insert data' }), {
      status: 500,
    });
  }
}
