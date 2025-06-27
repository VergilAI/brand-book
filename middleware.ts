import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'vergil-investors-portal-secret-key-2024'
);

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Only protect investors routes
  if (path.startsWith('/investors') && path !== '/investors/login') {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/investors/login', request.url));
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      
      // Check if user is trying to access admin panel
      if (path.startsWith('/investors/admin') && payload.role !== 'admin') {
        return NextResponse.redirect(new URL('/investors', request.url));
      }
      
      // Add user info to headers for pages to access
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', payload.id as string);
      requestHeaders.set('x-user-email', payload.email as string);
      requestHeaders.set('x-user-role', payload.role as string);
      requestHeaders.set('x-user-name', payload.name as string);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      // Invalid token, redirect to login
      return NextResponse.redirect(new URL('/investors/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/investors/:path*']
};