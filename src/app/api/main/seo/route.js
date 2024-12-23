// import axios from 'axios';
// import * as cheerio from 'cheerio';
// import material from './allMaterial.json';
// import grades from './grades501-rest.json'; 
// import { PrismaClient } from "@prisma/client";

import { NextResponse } from "next/server";

// const prisma = new PrismaClient();

// export async function GET(req) {
//   try {
//     const results=[]
//       Object.entries(grades).map(async ([key, url]) => {
//         try {
//             console.log(`processing ${key} with url ${url}`)
//           const { data: html } = await axios.get(url);

//           const $ = cheerio.load(html);

//           const title = $('meta[property="og:title"]').attr('content') || '';
//           const description = $('meta[property="og:description"]').attr('content') || '';
//           console.log(title,description,key)
//           const newItem = await prisma.seo.create({
//             data: {
//               type:"material",
//               name:key,
//               title,
//               description
//             },
//           });
//         console.log({name:key,title,description})
//          results.push({ name: key, title, description });
//         } catch (error) {
//           console.error(`Error scraping URL for ${key}:`, error.message);
//           return { name: key, error: error.message };
//         }
//       }
//     );

//     return new Response(JSON.stringify(results), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (error) {
//     console.error('Error processing request:', error.message);
//     return new Response(JSON.stringify({ error: 'Failed to process request' }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' },
//     });
//  } 
// //finally {
// //     await prismaClient.$disconnect();
// //   }
// }


// //301-400   1

export async function GET(){
    return new NextResponse("successful")
}