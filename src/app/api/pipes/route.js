import mysql from 'mysql2/promise'; 
import { NextResponse } from 'next/server'; 
import allCorousel from './elementorCorousel.json';
// Configure MySQL connection 
// const connectionConfig = { 
//   host: 'server36.secureclouddns.net', 
//   user: 'tpmsecure_wp451', 
//   password: 'p)2SBA1G[1', 
//   database: 'tpmsecure_wp451', 
// }; 
 //wordpress website wp_admin wp_password country
export async function POST(req) { 
  const { original_post_id, new_post_name, new_post_title, placeholders, specification, chemicalSpec, mechanicalSpec, db , grade, url, table_prefix, yoastTitle, yoastDesc} = await req.json(); 
  try { 
    console.log(placeholders);
    console.log(new_post_name)
    const connection = await mysql.createConnection({
      host:db.host.replace('https://', ''),
      user: db.username,
      password: db.password,
      database: db.database
    }); 
    
    // Step 1: Fetch original post data 
    const [postRows] = await connection.execute( 
      `SELECT * FROM ${table_prefix}_posts WHERE ID = ?`, 
      [original_post_id] 
    ); 
 
    if (postRows.length === 0) { 
      throw new Error(`Post with ID ${original_post_id} not found`); 
    } 
 
    const originalPost = postRows[0]; 
    let modifiedContent=originalPost.post_content;
    // Step 2: Insert new post 
    const [insertResult] = await connection.execute( 
      `INSERT INTO ${table_prefix}_posts ( 
        post_author, post_content, post_status, post_date, post_date_gmt, post_type, post_modified, post_modified_gmt, post_name, post_title 
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
      [ 
        originalPost.post_author, 
        originalPost.post_content.replace("{{title}}",new_post_title).replace("{{yoastTitle}}",yoastTitle).replace("{{yoastDesc}}",yoastDesc).replace("{{advantageImage}}",placeholders.advantageImage),
        "publish", 
        originalPost.post_date, 
        originalPost.post_date_gmt, 
        originalPost.post_type, 
        originalPost.post_modified, 
        originalPost.post_modified_gmt, 
        new_post_name, 

        new_post_title 
      ] 
    ); 
 
    const newPostId = insertResult.insertId; 
 
    // Step 3: Fetch metadata from wpmd_postmeta 
    const [metaRows] = await connection.execute( 
      `SELECT meta_key, meta_value FROM ${table_prefix}_postmeta WHERE post_id = ?`, 
      [original_post_id] 
    ); 
 
    // Step 4: Modify and insert cloned metadata 
    for (const metaRow of metaRows) { 
      let modifiedMetaValue = metaRow.meta_value; 
 
      if (metaRow.meta_key === '_elementor_data') { 
        // Parse the original Elementor data 
        let elementorData = JSON.parse(modifiedMetaValue); 
 
        // Generate the specification table 
        const tableHtml = generateSpecificationTable(specification); 
 
        // Generate the chemical table if provided 
        const chemicalTableHtml = generateChemicalTable(chemicalSpec); 
 
        // Generate the mechanical table if provided 
        const mechanicalTableHtml = generateMechanicalTable(mechanicalSpec); 
        console.log(url);
        const gradeData=generateGradeData(grade,url, placeholders.city);
        // Append all tables to placeholders 
        const combinedPlaceholders = { 
          ...placeholders, 
          specification: tableHtml, 
          chemicalSpec: chemicalTableHtml, 
          mechanicalSpec: mechanicalTableHtml,
          grade:gradeData
        }; 
        
        // Replace placeholders with the combined values 
        elementorData = populatePlaceholders(elementorData, combinedPlaceholders); 
        elementorData=replaceCarouselPlaceholder(elementorData,allCorousel[placeholders.category])
        // Convert back to JSON string 
        modifiedMetaValue = JSON.stringify(elementorData); 
      } 
      if(metaRow.meta_key==='_yoast_wpseo_title'){
        modifiedMetaValue=`${placeholders.title} ${placeholders.category} Manufacturer and Supplier in ${placeholders.city}, ${placeholders.country}`
      }
      if(metaRow.meta_key==='_yoast_wpseo_metadesc'){
        modifiedMetaValue=yoastDesc;
      }
      await connection.execute( 
        `INSERT INTO ${table_prefix}_postmeta (post_id, meta_key, meta_value) VALUES (?, ?, ?)`, 
        [newPostId, metaRow.meta_key, modifiedMetaValue] 
      ); 
    } 
 
    await connection.end(); 
 
    return NextResponse.json({ 
      message: 'Post and metadata cloned successfully with modified elementor data!', 
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
 
// Function to replace placeholders 
function populatePlaceholders(template, values) { 
  function replacePlaceholders(obj) { 
    if (typeof obj === "string") { 
      return obj.replace(/{{(.*?)}}/g, (match, key) => values[key.trim()] || match); 
    } else if (Array.isArray(obj)) { 
      return obj.map(replacePlaceholders); 
    } else if (typeof obj === "object" && obj !== null) { 
      const newObj = {}; 
      for (let key in obj) { 
        newObj[key] =replacePlaceholders(obj[key]); 
      } 
      return newObj; 
    } 
    return obj; 
  } 
  return replacePlaceholders(template); 
} 
function replaceCarouselPlaceholder(template, carouselData) {
  function traverse(obj) {
    if (typeof obj === "string") {
      // Replace the placeholder in strings
      return obj === "{{corousel}}" ? carouselData : obj;
    } else if (Array.isArray(obj)) {
      // Traverse arrays
      return obj.map(traverse);
    } else if (typeof obj === "object" && obj !== null) {
      // Traverse objects
      const newObj = {};
      for (const key in obj) {
        newObj[key] = traverse(obj[key]);
      }
      return newObj;
    }
    return obj; // Return other types unchanged
  }
  return traverse(template);
}

// Function to generate HTML table from the specification 
function generateSpecificationTable(specification) { 
  const temp = `<div class=\"table-responsive\">\n<table style=\"border: none; border-collapse: collapse;\"><colgroup> <col width=\"91\" /><col width=\"15\" /> <col width=\"518\" /></colgroup>\n<tbody>{{placeholder}}\n</tbody>\n</table>\n</div>`; 
  const rowholder = `\n<tr style=\"height: 26.5pt;\">{{cols}}\n</tr>`; 
  let rowsHtml = ''; 
 
  for (const key in specification) { 
    const cols = specification[key].map(col => `\n<td style=\"vertical-align: top; padding: 5pt 5pt 5pt 5pt; overflow: hidden; overflow-wrap: break-word; border: solid #d2d0d0 0.75pt;\">\n<p dir=\"ltr\" style=\"line-height: 1.7999999999999998; text-align: center; margin-top: 0pt; margin-bottom: 0pt;\"><span style=\"font-size: 12.499999999999998pt; font-family: Arial,sans-serif; color: #000000; background-color: transparent; font-weight: bold; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">${col}</span></p>\n</td>`).join(''); 
    const rowHtml = rowholder.replace('{{cols}}', cols); 
    rowsHtml += rowHtml + '\n'; 
  } 
 
  return temp.replace('{{placeholder}}', rowsHtml); 
} 
 
// Function to generate HTML table for chemical specifications 
function generateChemicalTable(chemicalSpec) { 
  const temp = `<div class=\"table-responsive\">\n<table style=\"border: none; border-collapse: collapse;\"><colgroup> <col width=\"87\" /> <col width=\"87\" /> <col width=\"95\" /> <col width=\"95\" /> <col width=\"87\" /> <col width=\"87\" /> <col width=\"87\" /></colgroup>
\n<tbody>
{{placeholder}}\n</tbody>\n</table>\n</div>`; 
  const rowholder = "\n</tr style=\"height: 26.5pt;\">{{cols}}\n</tr>"; 
  let rowsHtml = ''; 
 
  for (const key in chemicalSpec) { 
    const cols = chemicalSpec[key].map(col => `\n<td style=\"vertical-align: top; background-color: #ffffff; padding: 5pt 5pt 5pt 5pt; overflow: hidden; overflow-wrap: break-word; border: solid #d2d0d0 0.75pt;\">\n<p dir=\"ltr\" style=\"line-height: 1.7999999999999998; margin-top: 0pt; margin-bottom: 0pt;\"><span style=\"font-size: 12.499999999999998pt; font-family: Arial,sans-serif; color: #000000; background-color: transparent; font-weight: 400; font-style: normal; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;\">${col}</span></p>\n</td>`).join(''); 
    const rowHtml = rowholder.replace('{{cols}}', cols); 
    rowsHtml += rowHtml + '\n'; 
  } 
 
  return temp.replace('{{placeholder}}', rowsHtml); 
} 
 
// Function to generate HTML table for mechanical specifications 
function generateMechanicalTable(mechanicalSpec) { 
  const temp = `<div class=\"table-responsive\">\n<table style=\"border: none;\"><colgroup> <col width=\"244\" /> <col width=\"221\" /> <col width=\"160\" /></colgroup>\n<tbody>\n{{placeholder}}</tbody>\n</table>\n</div>`; 
  const rowholder = "<tr style=\"height: 26.5pt;\">\n{{cols}}</tr>\n"; 
  let rowsHtml = ''; 
 
  for (const key in mechanicalSpec) { 
    const cols = mechanicalSpec[key].map(col => `<td style=\"border-width: 0.75pt; border-color: #d2d0d0; background-color: #ffffff; padding: 5pt; overflow: hidden; overflow-wrap: break-word;\">\n<p dir=\"ltr\" style=\"line-height: 1.7999999999999998; margin-top: 0pt; margin-bottom: 0pt;\"><span style=\"font-size: 12.5pt; font-family: Arial, sans-serif; background-color: transparent; font-weight: bold; font-variant-numeric: normal; font-variant-east-asian: normal; font-variant-alternates: normal; font-variant-position: normal; vertical-align: baseline; white-space-collapse: preserve;\">${col}</span></p>\n</td>\n`).join(''); 
    const rowHtml = rowholder.replace('{{cols}}', cols); 
    rowsHtml += rowHtml + '\n'; 
  } 
 
  return temp.replace('{{placeholder}}', rowsHtml); 
}

function generateGradeData(grade,baseUrl, city) {
  const gradeListHtml = grade
    .map((gradeName) => {
      console.log(baseUrl,gradeName)
      const cityName = city.trim().replace(/\s+/g, '');
      const slug = gradeName.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-');; 
      return `
        <li>
          <a href="${baseUrl}${slug}${cityName}-TPM0001/">
            <span class="elementor-icon-list-text">
              ${gradeName}
            </span>
          </a>
        </li>`;
    })
    .join('\n');

  // Wrap the list in a <ul> tag
  return `<ul>${gradeListHtml}</ul>`;
}

