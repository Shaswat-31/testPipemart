import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    // Fetch all sites from the database
    const sites = await prisma.sites.findMany();
    return new Response(JSON.stringify(sites), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching sites:', error);
    return new Response(JSON.stringify({ error: 'Error fetching sites' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
