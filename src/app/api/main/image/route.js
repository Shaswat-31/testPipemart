import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // Step 1: Get the credentials and URL from the request body
    const { wpuser, wppass, url: wpurl } = await req.json();
    console.log('WP User:', wpuser);
    console.log('WP URL:', wpurl);
    console.log('WP Password:', wppass);

    // Step 2: Get the path to the images directory
    const industryDir = path.join(process.cwd(), 'public', 'industry');
    
    // Step 3: Read all files from the `industry` folder
    const files = fs.readdirSync(industryDir);
    console.log('Files in industry folder:', files);

    // Step 4: Authenticate with WordPress and get the Bearer token
    const authUrl = `${wpurl}/wp-json/jwt-auth/v1/token`;
    const authBody = new URLSearchParams({
      username: wpuser,
      password: wppass,
    });

    // Request authentication token from WordPress
    const authResponse = await fetch(authUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: authBody.toString(),
    });
    const authResult = await authResponse.json();
    if (!authResponse.ok) {
      throw new Error(authResult.message || 'Failed to authenticate');
    }
    const bearerToken = authResult.token;
    console.log('Bearer Token:', bearerToken);

    // Step 5: Upload each image from the `industry` folder to WordPress
    const uploadedImageUrls = []; // Array to store image URLs
    for (const file of files) {
      const filePath = path.join(industryDir, file);
      const fileBuffer = fs.readFileSync(filePath); // Read the image file into a buffer
      const formData = new FormData();
      formData.append('file', new Blob([fileBuffer], { type: 'image/jpeg' }), file); // Assuming all are JPEGs, you may need to check the file type

      // Upload to WordPress media endpoint
      const uploadResponse = await fetch(`${wpurl}/wp-json/wp/v2/media`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
        },
        body: formData,
      });
      const uploadResult = await uploadResponse.json();

      if (uploadResponse.ok) {
        // Extract the URL of the uploaded image and store it
        uploadedImageUrls.push(uploadResult.link); 
      } else {
        console.error('Failed to upload image:', uploadResult.message);
        throw new Error(uploadResult.message || 'Failed to upload image to WordPress');
      }
    }

    // Step 6: Return success message with all uploaded image URLs
    return NextResponse.json({
      message: 'All images uploaded to WordPress successfully',
      data: uploadedImageUrls, // Return only the image URLs
    }, { status: 200 });
  } catch (error) {
    console.error('Error uploading images:', error);
    return NextResponse.json({ message: 'Error uploading images', error: error.message }, { status: 500 });
  }
}
