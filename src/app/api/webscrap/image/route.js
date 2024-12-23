import axios from 'axios';
import * as cheerio from 'cheerio';
import allMaterial from './allMaterial.json';

export async function POST(req) {
  try {
    // Fetch the HTML content from the target website
    const body=await req.json()
    console.log(body)
    let {url}=body
    if (!url) {
      return new Response(
        JSON.stringify({ error: `No URL found for the title: ${title} pipes` }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Extract all image sources
    const imageSources = [];
    $('img').each((_, element) => {
      const src = $(element).attr('src');
      if (src) {
        imageSources.push(src);
      }
    });

    // Return the images as JSON
    return new Response(JSON.stringify({ images: imageSources }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch images' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
