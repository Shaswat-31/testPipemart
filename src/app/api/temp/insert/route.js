import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const { post_id, post_name, url, wordpressId } = body;

    // Insert a new entry in the 'templates' model
    const template = await prisma.templates.create({
      data: {
        post_id,
        post_name,
        url,
        wordpressId
      },
    });

    return new Response(JSON.stringify(template), { status: 200 });
  } catch (error) {
    console.error("Error inserting template data:", error);
    return new Response(JSON.stringify({ error: "Failed to insert data" }), {
      status: 500,
    });
  }
}
