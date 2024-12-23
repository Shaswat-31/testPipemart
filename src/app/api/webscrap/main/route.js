import axios from 'axios';
import * as cheerio from 'cheerio';

export async function GET(req) {
  try {
    const { data } = await axios.get(`https://www.pipingmart.ae/`);
    const $ = cheerio.load(data);

    // Extract all image sources
    const link = {};
    $('a').each((_, element) => {
      const href = $(element).attr('href');
      const spanText = $(element).find('span').text().trim();
      if (href) {
        link[spanText]=href;
      }
    });

    // Return the images as JSON
    return new Response(JSON.stringify(link), {
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
