import { z } from "zod";
//change required
// Define the schema for authenticating a WordPress site
export const authWorpresdWebsite = z.object({
  username: z
    .string()
    .min(1, "Username is required"), // Ensure username is not empty
  password: z
    .string()
    .max(128, "Password must be less than 128 characters long"), // Maximum length for password
    wpuser: z
    .string()
    .min(1, "Username is required"), // Ensure username is not empty
  wppass: z
    .string()
    .max(128, "Password must be less than 128 characters long"),
  url: z
    .string()
    .url("Invalid URL") // Validate URL format
    .min(1, "URL is required"), // Ensure URL is not empty
    country: z
    .string()
    .optional() // Make country optional
    .or(z.literal("")), // Allow empty string as a valid value
  language: z
    .string()
    .optional() // Make language optional
    .or(z.literal("")), // Allow empty string as a valid value
  slug: z
    .string()
    .min(1, "Slug is required"), // Ensure slug is not empty
  hostUrl: z
    .string()
    .min(1, "Host URL is required"), // Ensure host URL is not empty
  databaseName: z
    .string()
    .min(1, "Database Name is required"), // Ensure database name is not empty
    temp_id: z
    .number()
    .optional(), // Optional: This will be populated after step 1
  industry: z
    .array(z.string())
    .optional(), // Optional: This will be populated after step 2
  table_prefix: z
    .string()
    .min(1, "Table prefix is required"), 
});
