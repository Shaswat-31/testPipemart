import { deleteSchema, getSchema, postSchema, putSchema } from "@/schemas/product";
import { AddProductApiResponse, DeleteProductApiResponse, ProductResponse, UpdateProductApiResponse } from "@/types/ApiRespose";
import axios from "axios";
import { z } from "zod";
class V2Product {
    // For Get User
    async addProduct({ file, wordpressId }: z.infer<typeof postSchema>) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('wordpressId', wordpressId!);

        const response = await axios.post<AddProductApiResponse>('/v1/product', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }

    // For Get Active Clients Products
    async getProduct({ wordpressId }: z.infer<typeof getSchema>) {
        const response = await axios.get<ProductResponse>(`/v1/product?wordpressId=${wordpressId}`);
        return response.data;

    }

    // update Product
    async updateProduct({ productid, category, description, price, productName }: z.infer<typeof putSchema>) {
        const response = await axios.put<UpdateProductApiResponse>(`/v1/product?productid=${productid}`, {
            category,
            description,
            price,
            productName
        });
        return response.data;
    }

    // delete Product
    async deleteProduct({ productid }: z.infer<typeof deleteSchema>) {
        const response = await axios.delete<DeleteProductApiResponse>(`/v1/product?productid=${productid}`);
        return response.data;
    }
}

const V2ProductService = new V2Product();
export default V2ProductService