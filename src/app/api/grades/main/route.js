import grades from './grades.json';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log("Starting grade processing...");

    // Map through grades and extract required data
    const grade = Object.entries(grades).map(([name, data]) => {
      const linkKeys = Object.keys(data.links);
      return { name, linkKeys }; 
    });

    await Promise.all(
      grade.map(async (item) => {
        try {
          console.log(`Processing grade: ${item.name}, links: ${item.linkKeys}`);
          await prisma.gradeProduct.create({
            data: {
              name: item.name,
              grades: item.linkKeys,
            },
          });
        } catch (err) {
          console.error(`Failed to save grade: ${item.name}`, err);
        }
      })
    );
    

    console.log("Grade processing completed.");
    return NextResponse.json(grade); // Return structured result as JSON

  } catch (error) {
    console.error('Error processing grades:', error);
    return NextResponse.json({ error: 'Failed to process grades' }, { status: 500 });

  } finally {
    await prisma.$disconnect(); // Ensure Prisma client connection is closed
    console.log("Prisma client disconnected.");
  }
}
