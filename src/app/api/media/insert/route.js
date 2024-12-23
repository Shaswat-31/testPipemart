import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const { imgId, slug, link } = body;
    const imageResp = await fetch(link);
    if (!imageResp.ok) {
      throw new Error(`Failed to fetch image, status: ${imageResp.status}`);
    }
    const buffer = await imageResp.buffer();

    // Define path to save image in the `public` folder
    const filename = `${slug}.png`;
    const filePath = path.join(process.cwd(), 'public', filename);

    // Save image to the public folder
    // fs.writeFileSync(filePath, buffer);
    // Access the 'cities' model (camelCase is important here)
    const img = await prisma.image.create({
      data: {
        imgId,
        slug,
        link
      },
    });
    console.log(img)
    return new Response(JSON.stringify(img), { status: 201 });
  } catch (error) {
    console.error('Error inserting Image:', error);
    return new Response(JSON.stringify({ error: 'Failed to insert image' }), {
      status: 500,
    });
  }
}
