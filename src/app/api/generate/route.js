// Import the OpenAI client and file system module
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch'; // Use 'node-fetch' for downloading images in Node.js environment

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req, res) {
  const { prompt, type } = await req.json();

  if (!prompt) {
    return new Response(JSON.stringify({ message: 'Prompt is required' }), { status: 400 });
  }
  console.log(type);
  try {
    let response;
    if (type.file === 'image') {
      // Generate image
      const imageResponse = await openai.images.generate({
        prompt,
        n: 1,
        size: '1024x1024',
      });

      const imageUrl = imageResponse.data[0]?.url;
      if (!imageUrl) {
        return new Response(JSON.stringify({ message: 'No image generated' }), { status: 500 });
      }

      // Download the image
      const imageResp = await fetch(imageUrl);
      const buffer = await imageResp.buffer();

      // Define path to save image in the `public` folder
      const filename = `${type.name}-${Date.now()}.png`;
      const filePath = path.join(process.cwd(), 'public', filename);

      // Save image to the public folder
      fs.writeFileSync(filePath, buffer);

      // Return the URL path for the saved image
      response = { type: 'image', imagename: `${type.name}` };
    } else if (type.file === 'text') {
      // Generate text response
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
      });

      const text = completion.choices[0]?.message?.content || 'No response';
      response = { type: 'text', text };
    } else {
      return new Response(JSON.stringify({ message: 'Invalid type. Use "text" or "image".' }), { status: 400 });
    }

    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    console.error('Error generating content:', error);
    return new Response(JSON.stringify({ message: 'Error generating content' }), { status: 500 });
  }
}
