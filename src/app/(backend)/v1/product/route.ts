import { createErrorResponse, createResponse } from "@/lib/responseHanler";
import prisma from "@/lib/db";
import { parse } from "csv-parse/sync";

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    console.log(file);
    const wordpressId = data.get("wordpressId") as string;
    if (!wordpressId) {
      return createErrorResponse("WordPress ID is required", 404);
    }

    if (!file) {
      return createErrorResponse("CSV file is required", 404);
    }

    const wordpressWebsite = await prisma.wordPress.findUnique({
      where: { id: wordpressId },
    });

    if (!wordpressWebsite) {
      return createErrorResponse("WordPress Website Not Found", 404);
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileContent = buffer.toString();

    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });
    console.log(records);
    const newProducts: any = [];
    const skippedProducts = [];

    for (const record of records) {
      const { productName, price, description, category } = record;
      console.log(productName, price, description, category);
      if (!productName || !price || !description || !category) {
        console.warn(`Skipping invalid record: ${JSON.stringify(record)}`);
        continue;
      }

      // Check if a product with the same name and category already exists
      const existingProduct = await prisma.product.findFirst({
        where: {
          productName,
          category,
          wordpressId,
        },
      });

      if (existingProduct) {
        skippedProducts.push({ productName, category, reason: "Duplicate" });
        continue;
      }

      const newProduct = await prisma.product.create({
        data: {
          productName,
          price: parseFloat(price), // Ensure price is stored as a number
          description,
          category,
          wordpress: { connect: { id: wordpressId } },
        },
      });

      newProducts.push(newProduct);
    }

    return createResponse(true, "Product created successfully", {
      addedProducts: newProducts,
      skippedProducts: skippedProducts,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return createErrorResponse("Error adding product", 500, error);
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const wordpressId = searchParams.get("wordpressId");
    
    if (!wordpressId) {
      return createErrorResponse("WordPress ID is required", 400);
    }

    const products = await prisma.product.findMany({
      where: { wordpressId: wordpressId },
    });

    if (products.length === 0) {
      return createErrorResponse(
        "Products not found for the given WordPress ID",
        404
      );
    }

    return createResponse(true, "Products fetched successfully", {
      data: products,
    });
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return createErrorResponse("Error fetching products", 500, error.message);
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productid");
    console.log(productId);

    if (!productId) {
      return createErrorResponse("Product ID is required", 404);
    }

    const body = await request.json();
    const { productName, price, description, category } = body;

    // Find the existing product
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return createErrorResponse("Product Not Found", 404);
    }

    // Update the product
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        productName: productName || undefined,
        price: price !== undefined ? parseFloat(price) : undefined,
        description: description || undefined,
        category: category || undefined,
      },
    });

    return createResponse(true, "Product updated successfully", {
      product: updatedProduct,
    });
  } catch (error: any) {
    console.error("Error updating product:", error);
    return createErrorResponse("Error updating product", 500, error.message);
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productid");

    if (!productId) {
      return createErrorResponse("Product ID is required", 400);
    }

    // Delete the product
    const deletedProduct = await prisma.product.delete({
      where: { id: productId },
    });

    if (!deletedProduct) {
      return createErrorResponse("Product Not Found", 404);
    }

    return createResponse(
      true,
      "Product deleted successfully"
    );
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return createErrorResponse("Error deleting product", 500, error.message);
  }
}
