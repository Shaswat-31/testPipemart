// import axios from 'axios';
// import * as cheerio from 'cheerio';
// import allMaterials from '../allMaterial.json';

import { NextResponse } from "next/server";

// export async function GET() {
//   try {
//     const results = {};

//     for (const [title, url] of Object.entries(allMaterials)) {
//       if (!url) continue;

//       console.log(`Fetching data for: ${title} from URL: ${url}`);

//       try {
//         // Fetch the webpage
//         const { data } = await axios.get(url);
//         const $ = cheerio.load(data);

//         // Object to store the scraped links for the current material
//         const links = {};

//         // Scrape the list items
//         $('ul li').each((_, element) => {
//           const anchor = $(element).find('a'); // Find the anchor tag
//           const href = anchor.attr('href'); // Get the href attribute
//           const spanText = anchor.find('span.elementor-icon-list-text').text().trim(); // Get the span text
//           if (href && spanText) {
//             links[spanText] = href; // Add to the links object
//           }
//         });

//         // Filter links containing the material title (optional, based on your logic)
//         const filteredLinks = Object.fromEntries(
//           Object.entries(links).filter(([key]) => key.includes(title))
//         );

//         // Add the scraped data to results
//         results[title] = {
//           url,
//           links: Object.keys(filteredLinks).length ? filteredLinks : links,
//         };
//       } catch (scrapeError) {
//         console.error(`Failed to fetch data for: ${title} - ${scrapeError.message}`);
//         results[title] = { error: scrapeError.message || 'Scraping failed' };
//       }
//     }

//     // Return the consolidated results
//     return new Response(JSON.stringify(results), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (error) {
//     console.error('Error:', error.message || error);

//     // Return generic error response
//     return new Response(
//       JSON.stringify({ error: 'Failed to fetch data', details: error.message || error }),
//       {
//         status: 500,
//         headers: { 'Content-Type': 'application/json' },
//       }
//     );
//   }
// }
export async function GET(req){
    return new NextResponse("Successful")
}