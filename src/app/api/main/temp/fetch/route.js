import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';

export async function GET(req) {
  const original_post_id  = 108691 
  
  try {
    // Step 1: Establish a connection to the database
    const connection = await mysql.createConnection({
        host: 'server36.secureclouddns.net', 
        user: 'tpmsecure_wp451', 
        password: 'p)2SBA1G[1', 
        database: 'tpmsecure_wp451', 
    });

    // Step 2: Fetch post data from wpmd_posts
    const [postRows] = await connection.execute(
      'SELECT * FROM wpmd_posts WHERE ID = ?',
      [original_post_id]
    );

    // If no post found, return an error message
    if (postRows.length === 0) {
      throw new Error(`Post with ID ${original_post_id} not found`);
    }

    const originalPost = postRows[0];

    // Step 3: Fetch metadata from wpmd_postmeta
    const [metaRows] = await connection.execute(
      'SELECT meta_key, meta_value FROM wpmd_postmeta WHERE post_id = ?',
      [original_post_id]
    );

    // Step 4: Structure the response object for post and post_meta
    const posts = {
      post_author: originalPost.post_author,
      post_content: originalPost.post_content,
      post_status: originalPost.post_status,
      post_date: originalPost.post_date,
      post_date_gmt: originalPost.post_date_gmt,
      post_type: originalPost.post_type,
      post_modified: originalPost.post_modified,
      post_modified_gmt: originalPost.post_modified_gmt,
      post_name: originalPost.post_name,
      post_title: originalPost.post_title,
    };

    // Structure the post_meta as key-value pairs
    const post_meta = metaRows.reduce((acc, { meta_key, meta_value }) => {
      acc[meta_key] = meta_value;
      return acc;
    }, {});

    // Step 5: Close the connection
    await connection.end();

    // Step 6: Return the structured response
    return NextResponse.json({
      posts,
      post_meta,
    });
  } catch (error) {
    console.error('Error fetching post and metadata:', error);
    return NextResponse.json({
      error: 'Failed to fetch post and metadata',
      details: error.message,
    });
  }
}
