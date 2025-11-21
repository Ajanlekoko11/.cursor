import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  // Temporarily disabled to test if proxy is causing issues
  return NextResponse.next();
  
  /* Original code - commented out for debugging
  const session = request.cookies.get('session');
  const { pathname } = request.nextUrl;

  // Protect /app routes
  if (pathname.startsWith('/app') && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect authenticated users away from auth pages
  if ((pathname === '/login' || pathname === '/signup') && session) {
    return NextResponse.redirect(new URL('/app', request.url));
  }

  return NextResponse.next();
  */
}

export const config = {
  matcher: ['/app/:path*', '/login', '/signup'],
};

