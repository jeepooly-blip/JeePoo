import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['ar', 'en'],
  defaultLocale: 'ar',
  localePrefix: 'as-needed' // Arabic (default) won't show /ar in URL, English will show /en
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
