import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.nextUrl.hostname;
  const pathname = request.nextUrl.pathname;

  // Development mode
  if (hostname === 'localhost' || hostname.includes('127.0.0.1')) {
    return NextResponse.next();
  }

  // Production mode
  const mainDomain = 'jeepoo.vercel.app';

  // Main domain or www - show landing page
  if (hostname === mainDomain || hostname === `www.${mainDomain}`) {
    return NextResponse.next();
  }

  // Subdomain detected
  if (hostname.endsWith(`.${mainDomain}`)) {
    const subdomain = hostname.replace(`.${mainDomain}`, '');

    // Skip if already on the store route
    if (pathname.startsWith('/store/')) {
      return NextResponse.next();
    }

    // Rewrite to the store page
    const url = request.nextUrl.clone();
    url.pathname = `/store/${subdomain}${pathname}`;

    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
