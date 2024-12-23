import { createErrorResponse, createResponse } from "@/lib/responseHanler";
import axios from "axios";

export async function GET(request: Request) {
  try {
    // Extract query parameters from the request URL
    const url = new URL(request.url);
    const targetUrl = url.searchParams.get("url");

    if (!targetUrl) {
      return createErrorResponse("Url Required", 400);
    }

    // Fetch posts from the provided URL
    const posts = await axios.get(`${targetUrl}/wp-json/wp/v2/posts`);

    return createResponse(true, "All posts fetched", posts.data);
  } catch (error: any) {
    console.error("Error while fetching posts", error);
    return createErrorResponse("Error while fetching posts", 500, error);
  }
}
