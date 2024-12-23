
// utils.ts
import { NextResponse } from "next/server";

interface CookieOptions {
    name: string;
    value: string;
    options?: { [key: string]: any };
}

export function createResponse(
    success: boolean,
    message: string,
    data: { [key: string]: any } = {},
    status: number = 200,
    cookies: CookieOptions[] = []
) {
    const response = NextResponse.json({ success, message, ...data }, { status });

    cookies.forEach(cookie => {
        response.cookies.set(cookie.name, cookie.value, cookie.options);
    });
    return response;
}

export function createErrorResponse(
    message: string,
    status: number = 500,
    error: any = null
) {
    console.error(message, error); // Optional: log the error for debugging
    return NextResponse.json({ success: false, message,error }, { status });
}