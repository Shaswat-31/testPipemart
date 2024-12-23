import { z } from 'zod';

export const addCitySchema = z.object({
    id: z.string().optional(),   // Ensure WordPress ID is not empty
    cityName: z.string().min(1, 'City name is required'),
    state: z.string().min(1, 'State is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
});


export const updateCitySchema = z.object({
    wordpressId: z.string().min(1, 'WordPress ID is required'), // Ensure WordPress ID is not empty
    cityId: z.string().min(1, 'City ID is required'), // Ensure City ID is provided
    cityName: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
});

export const deleteCitySchema = z.object({
    wordpressId: z.string().min(1, 'WordPress ID is required'), // Ensure WordPress ID is provided
    cityId: z.string().min(1, 'City ID is required'), // Ensure City ID is provided
});

export const getSchema = z.object({
    wordpressId: z.string().min(1, 'Wordpress  ID is required'), // Ensure Product ID is provided
  });