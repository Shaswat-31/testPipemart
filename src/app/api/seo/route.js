import { PrismaClient } from "@prisma/client";

const prisma=new PrismaClient();
export async function POST(req){
    try {
    const body=await req.json();
    const {name}=body;

    if (!name) {
        return new Response(
          JSON.stringify({ error: 'Name parameter is required' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      const seoEntry = await prisma.seo.findMany({
        where: { name },
        select: {
          title: true,
          description: true,
        },
      });

      if (!seoEntry) {
        return new Response(
          JSON.stringify({ error: `SEO entry with name "${name}" not found` }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      }
      return new Response(
        JSON.stringify(seoEntry),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }catch (error) {
        console.error('Error processing the request:', error);
        return new Response(
          JSON.stringify({ error: 'An error occurred while processing the request' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
}