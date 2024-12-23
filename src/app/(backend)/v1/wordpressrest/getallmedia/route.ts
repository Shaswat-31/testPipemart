import { createErrorResponse, createResponse } from "@/lib/responseHanler";
import axios from "axios";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const targetUrl = url.searchParams.get("url");

    if (!targetUrl) {
      return createErrorResponse("Url Required", 400);
    }

    const posts = await axios.get(`${targetUrl}/wp-json/wp/v2/media`);

    return createResponse(true, "All media fetched", posts.data);
  } catch (error: any) {
    console.error("Error while fetching media", error);
    return createErrorResponse("Error while fetching media", 500, error);
  }
}
