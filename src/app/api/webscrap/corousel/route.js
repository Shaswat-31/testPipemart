import axios from 'axios';
import * as cheerio from 'cheerio';
import allMaterial from './allMaterial.json'
export async function POST(req) {
  try {
    // Fetch the HTML content from the target website
    const body=await req.json()
    console.log(body)
    let {title}=body
    if (!title) {
      return new Response(
        JSON.stringify({ error: 'Title is required in the request body' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
    const url = allMaterial[`${title}`];
    console.log(url);
    if (!url) {
      return new Response(
        JSON.stringify({ error: `No URL found for the title: ${title}` }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    console.log(`Fetching URL: ${url}`);
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Extract all image sources
    const imageSources = {};
    $('img').each((_, element) => {
      const src = $(element).attr('data-src');
      const alt=$(element).attr('alt');
      if (src) {
        imageSources[alt]=src;
      }
    });

    // Return the images as JSON
    return new Response(JSON.stringify(imageSources), {
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
