// import corousel from './corousel.json';

// export async function GET(req) {
//   // Generate carousel items for a category
//   const generateCarouselItems = (items) =>
//     Object.entries(items).map(([name, url]) => ({
//       url, // Only include the URL as required
//     }));

//   // Generate dynamic keys based on the number of links
//   const generateDynamicKeys = (length) => {
//     const baseSequence = ["#", "6", "1", "C", "E", "7", "0"]; // Elementor-compatible pattern
//     const dynamicKeys = {};
  
//     for (let i = 0; i < length; i++) {
//       dynamicKeys[i] = baseSequence[i % baseSequence.length]; // Cycle through the base pattern
//     }
  
//     return dynamicKeys;
//   };

//   // Template function for a category
//   const temp = (categoryItems) => [
//     {
//       id: "abed657",
//       elType: "widget",
//       settings: {
//         ...generateDynamicKeys(categoryItems.length), // Add dynamic keys
//         carousel: categoryItems, // Correctly scoped items for this category
//         thumbnail_size: "medium",
//         slides_to_show: "3",
//         slides_to_scroll: "3",
//         link_to: "custom",
//         caption_type: "caption",
//         lazyload: "yes",
//         autoplay_speed: 3000,
//         speed: 400,
//         arrows_position: "outside",
//         arrows_size: {
//           unit: "px",
//           size: 20,
//           sizes: [],
//         },
//         arrows_color: "#030303",
//         dots_position: "inside",
//         image_spacing: "custom",
//         image_spacing_custom: {
//           unit: "px",
//           size: 19,
//           sizes: [],
//         },
//         image_border_border: "none",
//         image_border_radius: {
//           unit: "px",
//           top: "30",
//           right: "0",
//           bottom: "30",
//           left: "0",
//           isLinked: false,
//         },
//         caption_text_color: "#000000",
//         caption_typography_typography: "custom",
//         caption_typography_font_family: "Georgia",
//         caption_typography_font_style: "normal",
//         navigation: "arrows",
//       },
//       elements: [],
//       widgetType: "image-carousel",
//     },
//   ];

//   // Build the final object with category-wise carousel arrays
//   const templates = Object.entries(corousel).reduce((acc, [category, items]) => {
//     const categoryItems = generateCarouselItems(items); // Generate carousel items for this category
//     acc[category] = temp(categoryItems); // Add category carousel to the result
//     return acc;
//   }, {});

//   return new Response(JSON.stringify(templates), {
//     status: 200,
//     headers: { "Content-Type": "application/json" },
//   });
// }
import { NextResponse } from "next/server";

export async function GET(){
    return new NextResponse("successful")
}