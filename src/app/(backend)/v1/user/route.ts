import { createErrorResponse, createResponse } from "@/lib/responseHanler";
import prisma from "@/lib/db";
import { userSchema } from "@/schemas/addUser";
import bcrypt from "bcrypt";

export async function GET(request: Request) {
  try {
    // Save the new user to the database
    const newUser = await prisma.user.findMany(); 
    return createResponse(true, "User fetched successfully", {
        newUser
    });
  } catch (error: any) {
    console.error("Error registering user:", error);
    return createErrorResponse("Error registering user", 500, error.message);
  }
}


const SALT_ROUNDS = 10;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, role } = body;

    // Validate the request body with Zod schema
    const result = userSchema.safeParse({ email, password, role });
    if (!result.success) {
      const { email: emailErrors, password: passwordErrors, role: roleErrors } = result.error.format();
      
      const errorMessage = [
        emailErrors?._errors?.join(", ") && `Email errors: ${emailErrors._errors.join(", ")}`,
        passwordErrors?._errors?.join(", ") && `Password errors: ${passwordErrors._errors.join(", ")}`,
        roleErrors?._errors?.join(", ") && `Role errors: ${roleErrors._errors.join(", ")}`,
      ].filter(Boolean).join(". ");

      return createErrorResponse(errorMessage.trim(), 400);
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return createErrorResponse("Email is already taken", 400);
    }

    // Generate hashed password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Save the new user to the database
    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword, role },
    });

    return createResponse(true, "User registered successfully.");
  } catch (error: any) {
    console.error("Error registering user:", error);
    return createErrorResponse("Error registering user", 500, error.message);
  }
}
