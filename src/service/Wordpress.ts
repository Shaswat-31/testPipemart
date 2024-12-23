import { authWorpresdWebsite } from "@/schemas/worpress";
import { AuthApiResponse, WordPressSitesResponse } from "@/types/ApiRespose";
import axios from "axios";
import { z } from "zod";

class V2Wordpress {
    // For Adding a WordPress Site
    async addwordpressite({
        slug,
        country,
        language,
        password,
        url,
        username,
        hostUrl,
        databaseName,
        wpuser,
        wppass,
        temp_id,
        industry,
        table_prefix
    }: z.infer<typeof authWorpresdWebsite>) {
        const response = await axios.post<AuthApiResponse>("/v1/wordpress/", {
            username,
            password,
            slug,
            country,
            language,
            url,
            hostUrl,
            databaseName,
            wpuser,
            wppass,
            temp_id,
            industry,
            table_prefix
        });
        return response.data;
    }

    // For Getting Active WordPress Sites
    async getwordpresssite() {
        const response = await axios.get<WordPressSitesResponse>("/v1/wordpress/");
        return response.data.data;
    }
}

const V2WordpressService = new V2Wordpress();
export default V2WordpressService;
