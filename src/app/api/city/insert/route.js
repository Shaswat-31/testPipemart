import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const { cityName, country } = body;

    // Validate that all required fields are provided
    if (!cityName || !country) {
      return new Response(
        JSON.stringify({ error: 'All fields are required' }),
        { status: 400 }
      );
    }

    // Access the 'cities' model (camelCase is important here)
    const city = await prisma.cities.create({
      data: {
        cityName,
        country
      },
    });

    return new Response(JSON.stringify(city), { status: 201 });
  } catch (error) {
    console.error('Error inserting city:', error);
    return new Response(JSON.stringify({ error: 'Failed to insert city' }), {
      status: 500,
    });
  }
}
