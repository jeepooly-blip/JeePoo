import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';

export default getRequestConfig(async () => {
  // Get locale from cookie or default to Arabic
  const headersList = headers();
  const cookieLocale = headersList.get('cookie')?.match(/NEXT_LOCALE=([^;]+)/)?.[1];
  const locale = cookieLocale || 'ar';

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
