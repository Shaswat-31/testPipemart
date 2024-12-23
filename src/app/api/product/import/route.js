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

    const insertedProducts = [];
    for (const sheet of sheets) {
      for (const row of sheet.data) {
        console.log(row);

        // Extract fields from the row, ensuring they exist
        const { title, titleDescription, topDescription } = row;
        const specification = row['specification'];
        const chemicalSpec = row['chemicalSpec'];
        const mechanicalSpec = row['mechanicalSpec'];
        console.log(specification)
        // Skip rows missing essential fields
        if (!title || !titleDescription || !topDescription) {
          console.warn(`Skipping row with missing essential fields:`, row);
          continue;
        }

        // Safely parse JSON strings for complex fields
        let parsedSpecification, parsedChemicalSpec, parsedMechanicalSpec;
        try {
          parsedSpecification = specification ? JSON.parse(specification) : {};
          parsedChemicalSpec = chemicalSpec ? JSON.parse(chemicalSpec) : {};
          parsedMechanicalSpec = mechanicalSpec ? JSON.parse(mechanicalSpec) : {};
        } catch (error) {
          console.warn(`Skipping row due to JSON parse error:`, row);
          continue; // Skip row if parsing fails
        }

        // Prepare the product data object
        const product = {
          title,
          titleDescription,
          topDescription,
          chemicalSpec: parsedChemicalSpec,
          specification: parsedSpecification,
          mechanicalSpec: parsedMechanicalSpec,
          status: 'Not Published',
        };

        // Add the product object to the array
        insertedProducts.push(product);
      }
    }

    // Return the parsed data for insertion (without inserting it)
    return NextResponse.json({ insertedProducts }, { status: 200 });
  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json({ error: 'Failed to process file' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
