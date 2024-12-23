import { z } from "zod";

// Define the enum for user roles
const UserRole = z.enum(['ADMIN', 'USER']); 

export const userSchema = z.object({
    email: z.string()
        .email("Invalid email address") // Ensure email is valid
        .transform(email => email.toLowerCase()), // Convert email to lowercase
    password: z.string().min(6, "Password must be at least 6 characters long"), // Ensure password length
    role: UserRole.optional() // Role is optional; can be 'admin' or 'user'
});

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Please enter your email" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(1, {
      message: "Please enter your password",
    })
    .min(7, {
      message: "Password must be at least 7 characters long",
    }),
});
