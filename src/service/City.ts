import { addCitySchema, deleteCitySchema, updateCitySchema } from "@/schemas/city";
import { getSchema, postSchema } from "@/schemas/product";
import { AddProductApiResponse, CityApiResponse, DeleteProductApiResponse, ProductResponse, UpdateProductApiResponse } from "@/types/ApiRespose";
import axios from "axios";
import { z } from "zod";
class V2City {

    async addCity({ file, wordpressId }: z.infer<typeof postSchema>) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('wordpressId', wordpressId!);

        const response = await axios.post<AddProductApiResponse>('/v1/city', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }

    // For Get Active Clients Products
    async getCity({ wordpressId }: z.infer<typeof getSchema>) {
        try {
            const response = await axios.get<CityApiResponse>(`/v1/city?id=${wordpressId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // update Product
    async updateCity({ cityId, wordpressId, cityName, postalCode, state }: z.infer<typeof updateCitySchema>) {
        try {
            const response = await axios.put<CityApiResponse>(`/v1/city?wordpressId=${wordpressId}`, {
                cityId, cityName, postalCode, state
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // delete Product
    async deleteCity({ cityId, wordpressId }: z.infer<typeof deleteCitySchema>) {
        try {
            const response = await axios.delete<CityApiResponse>(`/v1/city?wordpressId=${wordpressId}&cityId=${cityId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

const V2CityService = new V2City();
export default V2CityService