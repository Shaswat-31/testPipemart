import { PostsResponse } from "@/types/Post";
import axios from "axios";
class V2Post {
    // For Get Active Clients Products
    async getPost() {
        try {
            const response = await axios.get<PostsResponse>(`https://www.pipingmart.ae/wp-json/wp/v2/pages/`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

}

const V2PostService = new V2Post();
export default V2PostService