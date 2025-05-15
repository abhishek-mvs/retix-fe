import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require wallet connection
const PROTECTED_ROUTES = [
  '/sell',
  '/my-tickets',
  '/my-bids',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route requires wallet connection
  if (PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
    // Get the Privy authentication token from cookies
    const privyToken = request.cookies.get('privy-token')?.value;

    if (!privyToken) {
      // Redirect to home page if not authenticated
      const url = request.nextUrl.clone();
      url.pathname = '/';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/sell/:path*',
    '/my-tickets/:path*',
    '/my-bids/:path*',
  ],
}; 