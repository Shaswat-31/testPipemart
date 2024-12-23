import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    
    const {
    title,
     titleDescription,
    topDescription,
      specification,
      chemicalSpec,
      mechanicalSpec,
      advantage,
      application,
      choose,
      questions,
      images
    } = body;

    // Create a new item in the database using the Prisma client
    const newItem = await prisma.items.create({
      data: {
        title,
        titleDescription,
        topDescription,
        specification,
        chemicalSpec,
        mechanicalSpec,
        advantage,
        application,
        choose,
        questions,
        images
      },
    });

    return new Response(JSON.stringify(newItem), { status: 200 });
  } catch (error) {
    console.error('Error inserting data:', error);
    return new Response(JSON.stringify({ error: 'Failed to insert data' }), {
      status: 500,
    });
  }
}
