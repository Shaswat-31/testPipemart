export const dynamic = "force-dynamic"; // Ensure dynamic fetching

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    // Fetch cities from the database
    const cities = await prisma.cities.findMany();

    // Return cities with no-cache headers
    return new Response(JSON.stringify(cities), {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("Error fetching cities:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch cities" }), {
      status: 500,
    });
  }
}
