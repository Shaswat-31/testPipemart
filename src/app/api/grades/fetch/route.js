import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const body = await req.json();
    const { grade } = body;

    if (!grade) {
      return NextResponse.json(
        { error: "Grade is required" },
        { status: 400 }
      );
    }

    const responseData = await prisma.grades.findMany({
      where: {title: grade },
    });

    if (responseData.length === 0) {
      return NextResponse.json(
        { message: "No records found for the specified grade" },
        { status: 404 }
      );
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error fetching grades:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching grades" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
