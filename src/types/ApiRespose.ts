// Define the type for a single WordPress site
export interface WordPressSite {
    id: string;
    slug: string;
    url: string;
    username: string;
    password: string; // Optional, include if necessary
    wpuser: string;
    wppass: string;
    hostUrl: string; // New field for host URL
    databaseName: string; // New field for database name
    country: string;
    language: string;
    products: Product[]; // Replace `any` with a more specific type if possible
    cities: City[]; // Replace `any` with a more specific type if possible
    __v: number;
    temp_id:number;
    industry:string[];
    table_prefix: string;
}
//change
// Define the type for the response object
export interface WordPressSitesResponse {
    success: boolean;
    message: string;
    data: WordPressSite[];
}

export interface AuthApiResponse {
    success: boolean;
    message: string;
    error?: any; // Replace `any` with a more specific type if the `error` field has a defined structure
}


// PRODUCT

// Define the type for a single product
export interface Product {
    id: string;
    productName: string;
    price: number;
    description: string;
    category: string;
    wordpress: string;
    __v: number;
}

// Define the type for the response
export interface ProductResponse {
    success: boolean;
    message: string;
    data?: Product[];
    error?:string
}

interface SkippedProduct {
    productName: string;
    category: string;
    reason: string;
}

export interface AddProductApiResponse {
    success: boolean;
    message: string;
    addedProducts?: Product[];
    skippedProducts?: SkippedProduct[];
}

export interface DeleteProductApiResponse {
    success: boolean;
    message: string;
    error?: string | null;
}

interface UpdateProductSuccessResponse {
    success: true;
    message: string;
    product: Product;
}

interface UpdateProductErrorResponse {
    success: false;
    message: string;
    error: string;
}

export type UpdateProductApiResponse = UpdateProductSuccessResponse | UpdateProductErrorResponse;

// City 
// Define the type for individual city objects

export interface City {
    cityName: string;
    state: string;
    postalCode: string;
    id: string;
}

// Define the type for the API response
export interface CityApiResponse {
    success: boolean;
    message: string;
    error:string | null
    cities?: City[];
}   
