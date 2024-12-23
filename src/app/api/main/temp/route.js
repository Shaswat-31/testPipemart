import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';
import temp from './temp.json'; // Importing temp.json, assuming it contains the necessary data

export async function POST(req) {
  const { username, password, hostUrl, databaseName, table_prefix } = await req.json(); // Receive database connection details in the request body
  try {
    // Step 1: Establish a connection to the MySQL database
    const connection = await mysql.createConnection({
      host: hostUrl.replace('https://', ''),  // Ensure we are passing only the host part
      user: username,
      password: password,
      database: databaseName,
    });

    // Step 2: Extract the new post data from the input (temp.json or request body)
    const { 
      post_author,
      post_content,
      post_status,
      post_date,
      post_date_gmt,
      post_type,
      post_modified,
      post_modified_gmt,
      post_name,
      post_title 
    } = temp.posts;  
    console.log(temp.post_meta)
    const {post_meta}=temp;
    console.log(post_author)
    // Step 3: Insert the new post into wpmd_posts
    const [insertResult] = await connection.execute(
      `INSERT INTO ${table_prefix}_posts ( 
        post_author, post_content, post_status, post_date, post_date_gmt, 
        post_type, post_modified, post_modified_gmt, post_name, post_title
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        post_author,
        post_content,
        post_status,
        post_date,
        post_date_gmt,
        post_type,
        post_modified,
        post_modified_gmt,
        `${post_name}-1-2-3-4-5`,
        post_title,
      ]
    );

    const newPostId = insertResult.insertId; // Get the newly inserted post ID
    console.log(newPostId)

    // Step 4: Insert metadata into wpmd_postmeta for the newly created post
    const postMetaEntries = Object.entries(post_meta);
    console.log(postMetaEntries)
    for (const [meta_key, meta_value] of postMetaEntries) {
      await connection.execute(
        `INSERT INTO ${table_prefix}_postmeta (post_id, meta_key, meta_value) VALUES (?, ?, ?)`,
        [newPostId, meta_key, meta_value]
      );
    }

    // Step 5: Close the database connection
    await connection.end();

    // Step 6: Return a success response with the new post ID
    return NextResponse.json({
      message: 'Post created successfully with metadata!',
      newPostId,
    }, { status: 200 });
  } catch (error) {
    console.error('Error creating post and metadata:', error);
    return NextResponse.json({
      error: 'Failed to create post and metadata',
      details: error.message,
    }, { status: 500 });
  }
}
