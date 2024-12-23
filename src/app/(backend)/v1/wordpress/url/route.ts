import { createErrorResponse, createResponse } from "@/lib/responseHanler";
import { getServerSession, User } from "next-auth";
import axios from "axios";
import prisma from "@/lib/db";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";


export async function DELETE(request: Request) {
  try {
    // Extract the URL search parameters from the request
    const { searchParams } = new URL(request.url);

    // Extract the 'url' parameter from the query string
    const wordpressUrl = searchParams.get("url");

    if (!wordpressUrl) {
      return createErrorResponse("url is required", 400);
    }
    const session = await getServerSession(authOptions);
    const _user: User = session?.user!;
    if (!session || !_user) {
      return Response.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const result = await prisma.wordPress.deleteMany({
      where: { url: wordpressUrl },
    });

    if (result.count === 0) {
      return createErrorResponse("WordPress site not found", 404);
    }

    return createResponse(true, "WordPress site deleted successfully");
  } catch (error: any) {
    console.error("Error deleting WordPress site", error);
    return createErrorResponse(
      "Error deleting WordPress site",
      500,
      error.message
    );
  }
}
export async function GET(request: Request) {
  try {
    // Extract the URL search parameters from the request
    const { searchParams } = new URL(request.url);

    // Extract the 'url' parameter from the query string
    const wordpressUrl = searchParams.get("url");

    if (!wordpressUrl) {
      return createErrorResponse("url is required", 400);
    }

    const session = await getServerSession(authOptions);
    const _user: User = session?.user!;
    if (!session || !_user) {
      return Response.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const existingWordPressSite = await prisma.wordPress.findFirst({
      where: { url: wordpressUrl },
    });

    if (!existingWordPressSite) {
      return createErrorResponse("WordPress site not found", 404);
    }

    const [postsResponse, mediaResponse] = await Promise.all([
      axios.get(`${wordpressUrl}/wp-json/wp/v2/posts`),
      axios.get(`${wordpressUrl}/wp-json/wp/v2/media`),
    ]);

    return createResponse(
      true,
      "WordPress site post and media fetch successfully",
      {
        post: postsResponse.data,
        media: mediaResponse.data,
      }
    );
  } catch (error: any) {
    console.error("Error fetching WordPress data", error);
    return createErrorResponse(
      "Error fetching WordPress data",
      500,
      error.message
    );
  }
}
