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
    // Get the wallet connection status from cookies
    const walletConnected = request.cookies.get('wallet_connected')?.value === 'true';

    if (!walletConnected) {
      // Redirect to home page if wallet is not connected
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