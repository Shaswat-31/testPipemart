import prisma from "@/lib/db";
import { createErrorResponse, createResponse } from "@/lib/responseHanler";
import axios from "axios";

export async function POST(request: Request) {
  try {
    // Fetch data from the external API
    const response = await axios.get('https://www.pipingmart.ae/wp-json/wp/v2/pages/');
    const postData = response.data;

    // Iterate over the fetched posts and sync with the database
    for (const post of postData) {
      const postModifiedDate = new Date(post.modified).getTime();
      const postid = post.id.toString(); // Assuming post.id is an identifier

      // Find existing post by postid
      const existingPost = await prisma.postData.findUnique({
        where: { postid }, // Use postid for uniqueness check
      });

      const existingPostModifiedDate = existingPost ? new Date(existingPost.modified).getTime() : null;

      if (existingPost) {
        // Check if data has been modified
        if (existingPostModifiedDate !== postModifiedDate) {
          await prisma.postData.update({
            where: { postid }, // Use postid for update
            data: {
              data: post, // Store the whole object or map to specific fields
              modified: new Date(post.modified),
              slug: post.slug,
              status: post.status,
              type: post.type,
              link: post.link,
            },
          });
          console.log(`Updated post with postid ${postid}`);
        }
      } else {
        await prisma.postData.create({
          data: {
            postid,
            data: post, // Store the whole object or map to specific fields
            modified: new Date(post.modified),
            slug: post.slug,
            status: post.status,
            type: post.type,
            link: post.link,
          },
        });
        console.log(`Inserted new post with postid ${postid}`);
      }
    }

    // Return a success response
    return createResponse(true, "Sync completed", { postData });

  } catch (error: any) {
    console.error("Error syncing posts:", error);
    return createErrorResponse("Error syncing posts", 500, error.message);
  } finally {
    await prisma.$disconnect();
  }
}
