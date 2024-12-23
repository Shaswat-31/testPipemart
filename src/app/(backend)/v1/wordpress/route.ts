import prisma from "@/lib/db";
import { createErrorResponse, createResponse } from "@/lib/responseHanler";
import { WordPressAuth, WordpressAuthType } from "@/lib/WordpressAuth";
import { authWorpresdWebsite } from "@/schemas/worpress";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, password, url, language, country, slug, hostUrl, databaseName, wpuser, wppass, temp_id, industry, table_prefix } = body;

        const result = authWorpresdWebsite.safeParse({
            username,
            password,
            url,
            country,
            language,
            slug,
            hostUrl,
            databaseName,
            wpuser,
            wppass,
            temp_id,
            industry,
            table_prefix
        });

        if (!result.success) {
            const formattedErrors = result.error.format();
            let errorMessage = "";

            // Format error messages
            for (const [field, errors] of Object.entries(formattedErrors)) {
                if (errors && "_errors" in errors) {
                    errorMessage += `${field} errors: ${errors._errors.join(", ")}. `;
                }
            }

            // Return a formatted error response
            return createErrorResponse(errorMessage.trim(), 400);
        }

        const existingUrl = await prisma.wordPress.findFirst({ where: { url } });
        const existingSlug = await prisma.wordPress.findFirst({ where: { slug } });

        if (existingUrl) {
            return createErrorResponse("WordPress website url already added", 400);
        }
        if (existingSlug) {
            return createErrorResponse("Slug must be unique", 400);
        }

        // const isValid: WordpressAuthType = await WordPressAuth(
        //     username,
        //     password,
        //     url
        // );
            const hashedPassword = await bcrypt.hash(password, 10);

            const newWordpress = await prisma.wordPress.create({
                data: {
                    username,
                    password,
                    url,
                    country,
                    language,
                    slug,
                    hostUrl,
                    databaseName,
                    wpuser,
                    wppass,
                    temp_id,
                    industry,
                    table_prefix
                },
            });

            return createResponse(true, "WordPress Site added");
}
catch (error: any) {
    console.error("Error adding WordPress site", error);
    return createErrorResponse("Error adding WordPress site", 500, error.message);
}
}
export async function GET(request: Request) {
    try {
        // Fetch all WordPress sites from the database
        const wordPress = await prisma.wordPress.findMany();

        return createResponse(true, "WordPress fetched successfully", {
            data: wordPress,
        });
    } catch (error: any) {
        console.error("Error fetching WordPress sites:", error);
        return createErrorResponse("Error fetching WordPress sites", 500, error.message);
    }
}
