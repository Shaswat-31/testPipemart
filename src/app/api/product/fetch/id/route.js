import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  // Validate the id (ensure it is non-empty)
  if (!id) {
    return new Response(JSON.stringify({ error: "Valid ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Fetch the item by ID from the database
    const item = await prisma.allproducts.findUnique({
      where: { id }, // MongoDB id is a string
    });

    if (!item) {
      return new Response(JSON.stringify({ error: "Item not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(item), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching item:", error);
    return new Response(JSON.stringify({ error: "Error fetching item" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
