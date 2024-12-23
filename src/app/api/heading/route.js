import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const { title } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const headings = await prisma.productHeading.findMany({
      where: { title },
    });

    // Merge the results into a single JSON object
    const result = headings.reduce((acc, item) => ({ ...acc, ...item }), {});

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching headings:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch headings. Please try again later." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
