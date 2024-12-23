import fs from 'fs';
import path from 'path';

export async function GET(req) {
  try {
    // Define the path to the `public` folder
    const publicDir = path.join(process.cwd(), 'public');
    
    // Read all files in the `public` directory
    const files = fs.readdirSync(publicDir);

    // Filter for image files (you can adjust the extensions as needed)
    const images = files.filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));

    // Construct an object where each filename is a key with its URL as the value
    const imageData = images.reduce((acc, file) => {
        const filenameWithoutExtension = path.parse(file).name;  // Remove extension
        acc[filenameWithoutExtension] = `/${file}`;  // Assuming the image is directly in the public folder
      return acc;
    }, {});
    console.log(imageData);
    return new Response(JSON.stringify(imageData), { status: 200 });
  } catch (error) {
    console.error('Error fetching images:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch images' }), {
      status: 500,
    });
  }
}
