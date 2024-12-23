import axios from 'axios';
import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';

// Configure MySQL connection
// const connectionConfig = {
//   host: 'server36.secureclouddns.net',
//   user: 'tpmsecure_wp451', // Replace with your MySQL username
//   password: 'p)2SBA1G[1',  // Your MySQL password
//   database: 'tpmsecure_wp451', // Your database name
// };

export async function POST(req) {
  const { original_post_id, new_post_name, new_post_title, placeholders, db, table_prefix } = await req.json();
  try {
    console.log(db);
    console.log(db.host.replace('https://', ''));
    const connection = await mysql.createConnection({
      host:db.host.replace('https://', ''),
      user: db.username,
      password: db.password,
      database: db.database
    });
    // Step 1: Fetch original post data from wpmd_posts
    const [postRows] = await connection.execute(
      `SELECT * FROM ${table_prefix}_posts WHERE ID = ?`,
      [original_post_id]
    );

    if (postRows.length === 0) {
      throw new Error(`Post with ID ${original_post_id} not found`);
    }

    const originalPost = postRows[0];

    // Step 2: Modify post content (if needed)
    let modifiedPostContent = originalPost.post_content;

    // Step 3: Insert new post with new post_name and post_title
    const [insertResult] = await connection.execute(
      `INSERT INTO ${table_prefix}_posts (
        post_author, post_content, post_status, post_date, post_date_gmt, post_type, post_modified, post_modified_gmt, post_name, post_title
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        originalPost.post_author, 
        modifiedPostContent, 
        originalPost.post_status, 
        originalPost.post_date, 
        originalPost.post_date_gmt, 
        originalPost.post_type, 
        originalPost.post_modified, 
        originalPost.post_modified_gmt, 
        new_post_name, 
        new_post_title
      ]
    );

    const newPostId = insertResult.insertId; // New post ID

    // Step 4: Fetch metadata from wpmd_postmeta for original post
    const [metaRows] = await connection.execute(
      `SELECT meta_key, meta_value FROM ${table_prefix}_postmeta WHERE post_id = ?`,
      [original_post_id]
    );

    // Step 5: Modify and insert cloned metadata for new post
    for (const metaRow of metaRows) {
      let modifiedMetaValue = metaRow.meta_value;
      // If the current meta_key is related to Elementor data
      if (metaRow.meta_key === '_elementor_data') {
        try {
          // Parse the elementor_data JSON if it's stored as a string
          let elementorData = (modifiedMetaValue);
          elementorData=JSON.parse(elementorData);
          // Log the original Elementor data for debugging
         
          // Replace placeholders in the Elementor data using your function
          elementorData = replacePlaceholders(elementorData, placeholders);
        
          // Log the modified Elementor data for debugging
         
    
          // Convert the modified data back to a string if necessary
          modifiedMetaValue = JSON.stringify(elementorData, null, 2); // Proper formatting
         
        } catch (error) {
          console.error("Error parsing _elementor_data JSON:", error);
          throw new Error(`Failed to parse _elementor_data JSON for post ${original_post_id}`);
        }
      }
    
      // Insert the modified metadata for the new post
      await connection.execute(
        `INSERT INTO ${table_prefix}_postmeta (post_id, meta_key, meta_value) VALUES (?, ?, ?)`,
        [newPostId, metaRow.meta_key, modifiedMetaValue] // Insert the formatted JSON
      );
    }

    await connection.end();
    // const templateData = {
    //   post_id: newPostId, // Replace with the appropriate ID or use UUID if you need unique IDs
    //   post_name: new_post_name,
    //   url: `https://tpm.secureclouddns.net/${new_post_name}`, // Replace with actual URL if dynamic
    // };
    
    // await axios.post("http:localhost:3000/api/temp/insert", templateData);

    return NextResponse.json({
      message: 'Post and metadata cloned successfully with modified Elementor data! and inserted too',
      newPostId: newPostId,
    });
  } catch (error) {
    console.error('Error cloning post and metadata:', error);
    return NextResponse.json({
      error: 'Failed to clone post and metadata',
      details: error.message,
    });
  }
}

// Function to replace placeholders with corresponding sections
function replacePlaceholders(data, placeholder) {
  return data.map(item => {
    if (typeof item === 'string' && item.startsWith('{{') && item.endsWith('}}')) {
      // Extract the placeholder key (e.g., 'section1')
      const key = item.slice(2, -2);
      return placeholder[key] || item; // Replace with actual data or leave it as is if not found
    } else if (typeof item === 'object' && item !== null) {
      // Recursively handle nested objects/arrays
      return Array.isArray(item)
        ? replacePlaceholders(item, placeholder)
        : Object.fromEntries(
            Object.entries(item).map(([k, v]) => [k, replacePlaceholders([v], placeholder)[0]])
          );
    }
    return item;
  });
}



