// import prisma from "../../../../../../prisma/index";
import { createErrorResponse, createResponse } from "@/lib/responseHanler";
import { authWorpresdWebsite } from "@/schemas/worpress";
import axios from "axios";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password, url } = body;
    const result = authWorpresdWebsite.safeParse({
      username,
      password,
      url,
    });

    if (!result.success) {
      const formattedErrors = result.error.format();
      const usernameErrors = formattedErrors.username?._errors || [];
      const passwordErrors = formattedErrors.password?._errors || [];
      const urlErrors = formattedErrors.url?._errors || [];
      let errorMessage = "";
      if (usernameErrors.length > 0) {
        errorMessage += `Username errors: ${usernameErrors.join(", ")}. `;
      }
      if (passwordErrors.length > 0) {
        errorMessage += `Password errors: ${passwordErrors.join(", ")}. `;
      }
      if (urlErrors.length > 0) {
        errorMessage += `Url errors: ${urlErrors.join(", ")}. `;
      }
      return createErrorResponse(errorMessage.trim(), 400);
    }

    const loginResponse = await axios.post(
      `${url}/wp-json/jwt-auth/v1/token?username=${username}&password=${password}`
    );

    // Save the WordPress site to the database
    // await prisma.wordPress.create({
    //   data: {
    //     username,
    //     password,
    //     url,
    //     country: "",
    //     language: "",
    //     slug: url.replace(/^https?:\/\//, "").replace(/\/$/, ""),
    //   },
    // });

    return createResponse(true, "Verified and saved WordPress website", {
      user_email: loginResponse.data?.user_email,
      displayname: loginResponse.data.user_display_name,
      token: loginResponse.data.token,
    });
  } catch (error: any) {
    console.error("Error while verifying website", error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403) {
        return createErrorResponse(
          "Invalid username or password || JWT authentication is not properly configured on the WordPress site",
          403
        );
      } else if (error.response?.status === 401) {
        return createErrorResponse(
          "JWT authentication is not properly configured on the WordPress site",
          401
        );
      }
    }
    return createErrorResponse(
      "Error while verifying website",
      500,
      error.message
    );
  }
}
