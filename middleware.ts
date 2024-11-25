import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userCookie = request.cookies.get('user');
  const isAuthenticated = !!userCookie?.value;

  // Paths that don't require authentication
  const publicPaths = ['/', '/login'];

  // Check if the path is public
  const isPublicPath = publicPaths.includes(pathname);

  // If the path starts with /dashboard, it requires authentication
  if (pathname.startsWith('/dashboard')) {
    if (!isAuthenticated) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      return response;
    }
  }

  // If user is authenticated and tries to access login page, redirect to dashboard
  if (isAuthenticated && isPublicPath) {
    const response = NextResponse.redirect(new URL('/dashboard', request.url));
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
