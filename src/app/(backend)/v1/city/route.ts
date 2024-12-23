import prisma from "@/lib/db";
import { createErrorResponse, createResponse } from "@/lib/responseHanler";
import { parse } from "csv-parse/sync";


export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file = data.get("file") as File | null;
    const wordpressId = data.get("wordpressId") as string;

    if (!wordpressId) {
      return createErrorResponse("WordPress ID is required", 400);
    }

    if (!file) {
      return createErrorResponse("CSV file is required", 400);
    }

    const wordpressWebsite = await prisma.wordPress.findUnique({
      where: { id: wordpressId },
    });

    if (!wordpressWebsite) {
      return createErrorResponse("WordPress site not found", 404);
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileContent = buffer.toString();

    // Adjust the CSV parser to handle field names correctly
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });
    
    const newCities: any[] = [];
    const skippedCities: any[] = [];

    for (const record of records) {

      console.log(record);
      
      // Map CSV fields to your expected field names
      const cityName = record["City Name"];
      const state = record["State"];
      const postalCode = record["Postal Code"];
      if (!cityName || !state || !postalCode) {
        console.warn(`Skipping invalid record: ${JSON.stringify(record)}`);
        skippedCities.push({ ...record, reason: "Missing fields" });
        continue;
      }

      // Check if city with same name, state, and postalCode exists
      const existingCity = await prisma.city.findFirst({
        where: {
          cityName,
          state,
          postalCode,
          wordpressId,
        },
      });

      if (existingCity) {
        skippedCities.push({ cityName, state, postalCode, reason: "Duplicate" });
        continue;
      }

      const newCity = await prisma.city.create({
        data: {
          cityName,
          state,
          postalCode,
          wordpress: { connect: { id: wordpressId } },
        },
      });

      newCities.push(newCity);
    }

    return createResponse(true, "Cities added successfully", {
      addedCities: newCities,
      skippedCities,
    });
  } catch (error: any) {
    console.error("Error adding cities:", error);
    return createErrorResponse("Error adding cities", 500, error.message);
  }
}

// Delete a city
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const wordpressId = searchParams.get("wordpressId");
    const cityId = searchParams.get("cityId");

    if (!wordpressId || !cityId) {  
      return createErrorResponse("WordPress ID and City ID are required", 400);
    }

    const wordpressDoc = await prisma.wordPress.findFirst({
      where: {
        id: wordpressId,
        cities: {
          some: { id: cityId },
        },
      },
    });

    if (!wordpressDoc) {
      return createErrorResponse("WordPress site or City not found", 404);
    }

    const updatedWordPress = await prisma.wordPress.update({
      where: { id: wordpressId },
      data: {
        cities: {
          delete: { id: cityId },
        },
      },
      include: { cities: true },
    });

    return createResponse(true, "City removed successfully", {
      wordpress: updatedWordPress,
    });
  } catch (error: any) {
    console.error("Error deleting city:", error);
    return createErrorResponse("Error deleting city", 500, error.message);
  }
}

// Update a city
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const wordpressId = searchParams.get("wordpressId");

    if (!wordpressId) {
      return createErrorResponse("WordPress ID is required", 400);
    }

    const body = await request.json();
    const { cityName, state, postalCode, cityId } = body;

    if (!cityId) {
      return createErrorResponse("City ID is required", 400);
    }

    const wordpressDoc = await prisma.wordPress.findFirst({
      where: {
        id: wordpressId,
        cities: {
          some: { id: cityId },
        },
      },
    });

    if (!wordpressDoc) {
      return createErrorResponse("WordPress site or City not found", 404);
    }

    const updatedWordPress = await prisma.wordPress.update({
      where: { id: wordpressId },
      data: {
        cities: {
          update: {
            where: { id: cityId },
            data: { cityName, state, postalCode },
          },
        },
      },
      include: { cities: true },
    });

    return createResponse(true, "City updated successfully", {
      cities: updatedWordPress.cities,
    });
  } catch (error: any) {
    console.error("Error updating city:", error);
    return createErrorResponse("Error updating city", 500, error.message);
  }
}

// Get all cities for a WordPress site
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const wordpressId = searchParams.get("id");

    if (!wordpressId) {
      return createErrorResponse("WordPress ID is required", 400);
    }

    const wordpress = await prisma.wordPress.findUnique({
      where: { id: wordpressId },
      select: { cities: true },
    });

    if (!wordpress) {
      return createErrorResponse("WordPress site not found", 404);
    }

    return createResponse(true, "Cities fetched successfully", {
      cities: wordpress.cities,
    });
  } catch (error: any) {
    console.error("Error fetching cities:", error);
    return createErrorResponse("Error fetching cities", 500, error.message);
  }
}
