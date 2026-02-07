import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

// Locales configuration
const locales = ['ar', 'en'];
const defaultLocale = 'ar';

// Create next-intl middleware
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed', // Only add locale prefix when not default
});

export async function middleware(request: NextRequest) {
  const { hostname } = request.nextUrl;
  const pathname = request.nextUrl.pathname;

  // Get locale from cookie or Accept-Language header
  const locale = request.cookies.get('NEXT_LOCALE')?.value || defaultLocale;

  // Development mode - localhost
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    // Check if it's a subdomain test (e.g., store.localhost:3000)
    const parts = hostname.split('.');
    if (parts.length > 1 && parts[0] !== 'www') {
      const subdomain = parts[0];
      
      // Clone the URL and add subdomain as header
      const response = intlMiddleware(request);
      response.headers.set('x-vendor-slug', subdomain);
      response.headers.set('x-is-storefront', 'true');
      
      return response;
    }
    
    // Main domain in development
    return intlMiddleware(request);
  }

  // Production mode - jeepoo.com
  const mainDomain = process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'jeepoo.com';
  
  // Check if this is the main domain or www subdomain
  if (hostname === mainDomain || hostname === `www.${mainDomain}`) {
    // Landing page or dashboard routes
    return intlMiddleware(request);
  }

  // Extract subdomain for vendor storefront
  if (hostname.endsWith(`.${mainDomain}`)) {
    const subdomain = hostname.replace(`.${mainDomain}`, '');
    
    // Avoid processing on 'www' subdomain
    if (subdomain === 'www') {
      return intlMiddleware(request);
    }

    // This is a vendor storefront
    const response = intlMiddleware(request);
    response.headers.set('x-vendor-slug', subdomain);
    response.headers.set('x-is-storefront', 'true');
    
    return response;
  }

  // Default: process with intl middleware
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for:
  // - API routes
  // - Static files (_next/static)
  // - Image optimization files (_next/image)
  // - Favicon, etc.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
