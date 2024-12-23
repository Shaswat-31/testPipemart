import { createErrorResponse, createResponse } from "@/lib/responseHanler";
import { authWorpresdWebsite } from "@/schemas/worpress";
import axios from "axios";

export interface WordpressAuthType  {
    success: boolean,
    message: string,
    user_email?: string,
    displayname?: string,
    token?: string
}
export async function WordPressAuth(username: string, password: string, url: string):Promise<WordpressAuthType> {
    try {
        const loginResponse = await axios.post('https://newtpm.secureclouddns.net/wp-json/jwt-auth/v1/token', {
            username: username,
            password: password
        }, {
            headers: { 'Content-Type': 'application/json' }
        });
        
        return {
            success: true,
            message: "Verified Wordpress website",
            user_email: loginResponse.data?.user_email,
            displayname: loginResponse.data.user_display_name,
            token: loginResponse.data.token
        }
        
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 403) {
                return {
                    success: false,
                    message: "Invalid username or password || JWT authentication is not properly configured on the WordPress site",
                }
            } else if (error.response?.status === 401) {
                return {
                    success: false,
                    message: "JWT authentication is not properly configured on the WordPress site",
                }
            }
        }
        return {
            success: false,
            message: "Error while verifying website",
        }
    }
}
