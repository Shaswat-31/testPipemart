// app/api/upload-excel/route.js
import { NextResponse } from 'next/server';
import multer from 'multer';
import * as XLSX from 'xlsx';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Configure multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Parse form data with multer
const parseFormData = (req) =>
  new Promise((resolve, reject) => {
    upload.single('file')(req, {}, (err) => {
      if (err) reject(err);
      else resolve(req.file);
    });
  });

export async function POST(req) {
  try {
    // Parse the uploaded file
    const formData = await req.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Convert file to buffer for processing with xlsx
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse the Excel file with xlsx
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheets = workbook.SheetNames.map((sheetName) => ({
      sheetName,
      data: XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]),
    }));

    // Insert each row into the database
    const insertedCities = [];
    for (const sheet of sheets) {
      for (const row of sheet.data) {
        const { cityName, postalCode, state, country } = row;

        // Validate each row has necessary fields
        if (!cityName || !postalCode || !state || !country) {
          continue; // Skip rows with missing data
        }

        // Insert into Prisma cities model
        const city = ({
            cityName,
            postalCode: String(postalCode),
            state,
            country,
        });
        console.log(city);
        insertedCities.push(city);
      }
    }

    // Return the inserted data as JSON
    return NextResponse.json({ insertedCities }, { status: 201 });
  } catch (error) {
    console.error('Error processing file or inserting cities:', error);
    return NextResponse.json({ error: 'Failed to process and insert data' }, { status: 500 });
  } finally {
    await prisma.$disconnect(); // Ensure Prisma disconnects after operation
  }
}
