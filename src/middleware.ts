import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

// Default export for NextAuth middleware
export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/login', '/dashboard/:path*', '/', ],
};

export async function middleware(request: NextRequest) {  
  const token = await getToken({ req: request });
  
  const { pathname, origin } = request.nextUrl;

  // Redirect authenticated users from the sign-in page to the dashboard
  if (token && (pathname === '/login' )) {
    return NextResponse.redirect(`${origin}/`);
  }

  // Redirect unauthenticated users from any protected page to the sign-in page
  if (!token && (pathname.startsWith('/dashboard') || pathname === '/')) {
    return NextResponse.redirect(`${origin}/login`);
  }

  // Allow requests to proceed if conditions are not met
  return NextResponse.next();
}