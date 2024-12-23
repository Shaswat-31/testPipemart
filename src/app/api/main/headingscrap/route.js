// const allMaterial = require('./onlyGrades.json');
// const axios = require('axios');
// const cheerio = require('cheerio');
// const { PrismaClient } = require('@prisma/client');

// const prisma = new PrismaClient();

// export async function GET(req) {
//   try {
//     const keys = Object.keys(allMaterial);
//     const urls = Object.values(allMaterial);
//     const result = {};

//     // Function to fetch and process each URL
//     const fetchAndProcess = async (url, key) => {
//       try {
//         const { data } = await axios.get(url);
//         const $ = cheerio.load(data);
//         const headings = [];

//         $('h3.elementor-heading-title.elementor-size-default').each((_, element) => {
//           const text = $(element).text();
//           if (text.length > 70) {
//             headings.push(text.trim());
//           }
//         });

//         // Save to database
//         await prisma.productHeading.create({
//           data: {
//             title: key,
//             heading: headings,
//           },
//         });

//         result[key] = headings;
//         console.log(`Processed: ${key}`);
//       } catch (err) {
//         console.error(`Error processing ${key}: ${err.message}`);
//       }
//     };

//     // Limit concurrency
//     const concurrencyLimit = 10;
//     const tasks = [];
//     for (let i = 0; i < urls.length; i += concurrencyLimit) {
//       const chunk = urls.slice(i, i + concurrencyLimit).map((url, idx) => 
//         fetchAndProcess(url, keys[i + idx])
//       );
//       await Promise.all(chunk);
//     }

//     return new Response(JSON.stringify(result), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } catch (error) {
//     console.error('General error:', error.message);
//     return new Response(JSON.stringify({ error: error.message }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' },
//     });
//   } finally {
//     await prisma.$disconnect();
//   }
// }
import { NextResponse } from "next/server";

export async function GET(){
    return new NextResponse("successful")
}