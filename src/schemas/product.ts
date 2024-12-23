import { z } from 'zod';

export const postSchema = z.object({
  file: z.instanceof(File)
  .refine(
    (file) => {
      const validTypes = [
        'text/csv', // MIME type for CSV files
      ];
      return validTypes.includes(file.type);
    },
    {
      message: "Only CSV files are allowed",
    }
  ),
  wordpressId: z.string().optional(), // Ensure WordPress ID is not empty
});

export const putSchema = z.object({
  productid: z.string().optional(), // Ensure Product ID is provided
  productName: z.string().optional(), // Optional fields, if not provided, will not update
  price: z.any().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
});


export const deleteSchema = z.object({
  productid: z.string().min(1, 'Product ID is required'), // Ensure Product ID is provided
});

export const getSchema = z.object({
  wordpressId: z.string().min(1, 'Wordpress  ID is required'), // Ensure Product ID is provided
});