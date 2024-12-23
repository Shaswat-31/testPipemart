import { NextResponse } from 'next/server';

export async function POST(req) {
  try {

    const data = await req.formData();
    const file = data.get('file');
    const wpuser=data.get('wpuser');
    const wppass=data.get('wppass')
    const wpurl=data.get('wpurl');
    console.log(wpuser);
    console.log(wppass);
    if (!file) {
      return NextResponse.json({ message: 'No image found' });
    }
    console.log(file)
    const byteData = await file.arrayBuffer();
    const buffer = Buffer.from(byteData);

    // Authentication URL and credentials
    const authUrl = `${wpurl}/wp-json/jwt-auth/v1/token`;
    const authBody = new URLSearchParams({
      username: `${wpuser}`,
      password: `${wppass}`,
    });
    
    // Step 1: Get the Bearer Token
    const authResponse = await fetch(authUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: authBody.toString(),
    });
    console.log(authResponse)
    const authResult = await authResponse.json();
    console.log(authResult)
    if (!authResponse.ok) {
      throw new Error(authResult.message || 'Failed to authenticate');
    }

    const bearerToken = authResult.token;
    console.log(bearerToken)
    // Step 2: Upload the image to WordPress
    const wpUrl = `${wpurl}/wp-json/wp/v2/media`;
    const formData = new FormData();
    formData.append('file', new Blob([buffer], { type: file.type }), file.name);

    const uploadResponse = await fetch(wpUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
      body: formData,
    });
    console.log(uploadResponse)
    const uploadResult = await uploadResponse.json();
    
    if (!uploadResponse.ok) {
      throw new Error(uploadResult.message || 'Failed to upload image to WordPress');
    }
    console.log(uploadResult.link)
    return NextResponse.json({ message: 'File uploaded to WordPress', data: uploadResult });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ message: 'Error uploading file', error: error.message }, { status: 500 });
  }
}
