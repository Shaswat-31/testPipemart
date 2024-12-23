// import axios from 'axios';
// import * as cheerio from 'cheerio';
// import allMaterials from './allMaterial.json';

import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     // Parse request body
//     const body = await req.json();
//     const { title } = body;

//     // Validate the title
//     if (!title) {
//       return new Response(
//         JSON.stringify({ error: 'Title is required in the request body' }),
//         {
//           status: 400,
//           headers: { 'Content-Type': 'application/json' },
//         }
//       );
//     }
//     const url = allMaterials[`${title} Pipes`];
//     console.log(url)
//     if (!url) {
//       return new Response(
//         JSON.stringify({ error: `No URL found for title: ${title}` }),
//         {
//           status: 404,
//           headers: { 'Content-Type': 'application/json' },
//         }
//       );
//     }

//     console.log(`Fetching data from URL: ${url}`);
    
//     // Fetch the webpage
//     const { data } = await axios.get(url);
//     const $ = cheerio.load(data);

//     // Object to store the scraped links
//     const links = {};

//     // Scrape the list items
//     $('ul li').each((_, element) => {
//       const anchor = $(element).find('a'); // Find the anchor tag
//       const href = anchor.attr('href'); // Get the href attribute
//       const spanText = anchor.find('span.elementor-icon-list-text').text().trim(); // Get the span text
//       if (href && spanText) {
//         links[spanText] = href; // Add to the links object
//       }
//     });

//     // Filter links containing "Stainless Steel"
//     const filteredLinks = Object.fromEntries(
//       Object.entries(links).filter(([key]) => key.includes(`${title}`))
//     );

//     // Handle empty filtered results
//     if (Object.keys(filteredLinks).length === 0) {
//       return new Response(
//         JSON.stringify({ message: 'No links found containing "Stainless Steel"' }),
//         {
//           status: 404,
//           headers: { 'Content-Type': 'application/json' },
//         }
//       );
//     }

//     // Return the filtered links
//     return new Response(JSON.stringify(filteredLinks), {
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