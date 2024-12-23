// import { PrismaClient } from '@prisma/client';
// import { NextResponse } from 'next/server';
// import axios from 'axios';
// import allMaterial from './allMaterial.json';  // Import allMaterial.json

// const prisma = new PrismaClient();

// export async function GET(req) {
//     const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
//     try {
//         console.log("Starting data processing...");

//         // Use allMaterial data instead of fetching from Prisma
//         const materials = Object.keys(allMaterial); // Extract material names from the JSON
//         const results = [];

//         for (const material of materials) {
//             const materialURL = allMaterial[material]; // Get the URL for the material
//             console.log(`Processing material: ${material} - ${materialURL}`);

//             // Fetch image URLs
//             const imageResponse = await axios.post(`${baseURL}/api/webscrap/image`, { url: materialURL });
//             const trimmedImageArr = imageResponse.data.images.slice(1, -1); // Slice the image array as required

//             // Fetch specifications for the material
//             const { chemicalSpec, physicalSpec, mechanicalSpec } = await fetchSpecifications(material);

//             // Fetch additional AI-generated content (advantage, application, etc.)
//             const additionalPrompts = [
//                 { 
//                     prompt: `List the advantages of ${material}. Use only <ol><li> tags for each point, and highlight key phrases with <b>bold</b> tags. Ensure the points are concise, clear, and professional.`, 
//                     name: "advantages" 
//                 },
//                 { 
//                     prompt: `Write the application of ${material} in industries as a list with a total of n number of points. Use only <ol><li> tags for the structure and include <b>bold</b> tags for specific points. Ensure the language is professional and relevant to industrial contexts.`, 
//                     name: "applications" 
//                 },
//                 { 
//                     prompt: `Write the answer to "How to Choose ${material}?" in at least 7 points. Use only <ol><li> tags, and include <b>bold</b> tags for key details in each point. Ensure the advice is clear, professional, and informative.`, 
//                     name: "choose product" 
//                 },
//                 { 
//                     prompt: `Generate 4 question-answer pairs for ${material}. Ensure the output is in a **valid JSON format**. Use the structure: 
//                     {
//                         "questions": [
//                             {
//                                 "question": "Write a clear and concise question related to ${material}.",
//                                 "answer": "Provide a detailed and professional answer to the question."
//                             },
//                             {
//                                 "question": "Another relevant question about ${material}.",
//                                 "answer": "Corresponding professional and accurate answer."
//                             },
//                             ...
//                         ]
//                     } 
//                     Ensure proper JSON syntax with double quotes around all keys and values.`, 
//                     name: "questions" 
//                 },
//                 {
//                     "prompt": `Choose 4 industries from the following array that are most relevant to ${material}. Return them as an array of industry names (e.g., ["aerospace industry", "automotive industry", "chemical processing plants", ...]):
//                               Array: [
//                                   aerospace industry,
//                                   automotive industry,
//                                   aviation industry,
//                                   chemical processing plants,
//                                   construction and infrastructure industry,
//                                   food processing industry,
//                                   marine industry,
//                                   nuclear industry,
//                                   oil and gas industry,
//                                   petrochemical industry,
//                                   pharmaceutical industry,
//                                   power generation industry,
//                                   water treatment plants
//                               ]`,
//                     "type": {
//                         "file": "text",
//                         "name": "applicationIndustry"
//                     }
//                 },
//                 {
//                     "prompt": `Provide a very short summary (a few sentences) of the main applications of ${material}. This summary should be a concise, professional, and easy-to-understand overview of where and how this material is used in various industries. Include key details and use appropriate language for an industrial context.`,
//                     "name": "applicationSummary"
//                 }
//             ];

//             // Fetch additional data from AI for advantages, application, etc.
//             const additionalRequests = additionalPrompts.map(({ prompt, name }) =>
//                 axios.post(`${baseURL}/api/generate`, { prompt, type: { file: "text", name } })
//             );
//             const [advantage, application, choose, questions, applicationIndustry, applicationSummary] = await Promise.all(additionalRequests);

//             const quest = JSON.parse(questions.data.text);

//             // Parse the applicationIndustry response as an array
//             const industryArray = JSON.parse(applicationIndustry.data.text || '[]');

//             // Fetch descriptions for the material
//             const titleDesJson = {
//                 "prompt": `Generate a description for ${material} like = Discover excellence in stainless steel round pipes at our product pages, offering a comprehensive range of top-quality solutions. Explore the versatility of SS Pipes, meticulously designed for diverse industrial applications. Our product pages showcase precision-manufactured pipes, ensuring compliance with industry standards for durability and corrosion resistance. As a trusted supplier, we prioritize customer satisfaction etc for ${material}.`,
//                 "type": {
//                     "file": "text",
//                     "name": "QuestionAnswer"
//                 }
//             };
//             const topDesJson = {
//                 "prompt": `Generate a description for ${material} like = At PipingMart, we take pride in being one of the largest suppliers and manufacturers, offering cutting-edge solutions for all your needs. With state-of-the-art production plants ..... etc for ${material}`,
//                 "type": {
//                     "file": "text",
//                     "name": "QuestionAnswer"
//                 }
//             };
//             const titleDescription = await axios.post(`${baseURL}/api/generate`, titleDesJson);
//             const topDescription = await axios.post(`${baseURL}/api/generate`, topDesJson);

//             // Construct payload for Prisma
//             const jsonPayload = {
//                 title: material,
//                 titleDescription: titleDescription.data.text,
//                 topDescription: topDescription.data.text,
//                 chemicalSpec,
//                 physicalSpec,
//                 mechanicalSpec,
//                 advantage: advantage.data.text,
//                 application: application.data.text,
//                 choose: choose.data.text,
//                 questions: quest.questions,
//                 images: trimmedImageArr,
//                 industry: industryArray, // Add the industry array
//                 applicationSummary: applicationSummary.data.text // Add the application summary
//             };

//             console.log(jsonPayload);

//             // Store in Prisma database
//             await prisma.allproducts.create({
//                 data: {
//                     title: jsonPayload.title,
//                     titleDescription: jsonPayload.titleDescription || null,
//                     topDescription: jsonPayload.topDescription || null,
//                     specification: jsonPayload.physicalSpec || {},
//                     chemicalSpec: jsonPayload.chemicalSpec || {},
//                     mechanicalSpec: jsonPayload.mechanicalSpec || {},
//                     advantage: jsonPayload.advantage || "",
//                     application: jsonPayload.application || "",
//                     choose: jsonPayload.choose || "",
//                     questions: jsonPayload.questions || {},
//                     images: jsonPayload.images || [],
//                     applicationSummary: jsonPayload.applicationSummary || "",
//                     industry: jsonPayload.industry
//                 },
//             });

//             results.push(jsonPayload); // Collect results for the response
//         }

//         return NextResponse.json(results);
//     } catch (error) {
//         console.error("Error occurred:", error);
//         return NextResponse.json({ error: error.message }, { status: 500 });
//     }
// }

// // Helper function to fetch specifications for a given material
// const fetchSpecifications = async (material) => {
//     const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
//     console.log(`Fetching specifications for ${material}`);

//     try {
//         const requests = ['chemical', 'physical', 'mechanical'].map((type) =>
//             axios.post(`${baseURL}/api/generate`, {
//                 prompt: generatePrompt(type, material),
//                 type: { file: "text", name: type },
//             })
//         );

//         const [chemicalRes, physicalRes, mechanicalRes] = await Promise.all(requests);
//         console.log(`Specifications fetched for ${material}:`, {
//             chemical: chemicalRes.data,
//             physical: physicalRes.data,
//             mechanical: mechanicalRes.data,
//         });

//         return {
//             chemicalSpec: JSON.parse(chemicalRes.data.text || "{}"),
//             physicalSpec: JSON.parse(physicalRes.data.text || "{}"),
//             mechanicalSpec: JSON.parse(mechanicalRes.data.text || "{}"),
//         };
//     } catch (err) {
//         console.error(`Error fetching specifications for ${material}:`, err);
//         throw err;
//     }
// };

// // Helper function to generate prompts for AI
// const generatePrompt = (type, productValue) => {
//     const prompts = {
//         chemical: `Generate a JSON table with the format: { "row1": ["Column1Data", "Column2Data", ...], "row2": [...], ... }. The table should list the chemical specifications of the product "${productValue}". Include columns for "Chemical Name", "Chemical Formula", "Concentration (%)", and "Purity Level". Ensure all data entries are realistic and relevant to ${productValue}.`,
//         physical: `Generate a JSON table with the format: { "row1": ["Column1Data", "Column2Data", ...], "row2": [...], ... }. The table should list the physical specifications of the product "${productValue}". Include columns for "Property Name", "Unit of Measurement", "Typical Value", and "Range (if applicable)". Examples of properties include "Density", "Melting Point", "Boiling Point", and "Viscosity". Provide realistic data for ${productValue}.`,
//         mechanical: `Generate a JSON table with the format: { "row1": ["Column1Data", "Column2Data", ...], "row2": [...], ... }. The table should list the mechanical specifications of the product "${productValue}". Include columns for "Property Name", "Measurement Unit", "Value", and "Test Standard". Examples of properties include "Tensile Strength", "Hardness", "Modulus of Elasticity", and "Yield Strength". Provide realistic and relevant data for ${productValue}.`,
//     };
//     return prompts[type];
// };
import { NextResponse } from "next/server";

export async function GET(){
    return new NextResponse("successful")
}