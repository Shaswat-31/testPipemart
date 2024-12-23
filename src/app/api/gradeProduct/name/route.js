import { PrismaClient } from "@prisma/client"; 
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req) {
    try {
        // Parse the request body
        const body = await req.json();
        const { name } = body;
        console.log(name)
        // Validate that 'name' is provided
        if (!name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        // Query the database for grades with the matching name
        const gradeProducts = await prisma.gradeProduct.findMany({
            where: {
                name: name,
            },
        });

        // Extract only the grades property
        const grades = gradeProducts[0].grades;

        // Return the extracted grades
        return NextResponse.json(grades);
    } catch (error) {
        // Handle errors gracefully
        console.error("Error fetching grades:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
