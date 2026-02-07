import type { Metadata } from 'next';
import { Cairo, Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import './globals.css';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'JeePoo - Multi-Vendor E-Commerce Platform',
  description: 'Launch your online store in minutes - For bakeries, groceries, and florists in Jordan',
  keywords: ['e-commerce', 'jordan', 'bakery', 'grocery', 'florist', 'online store'],
};

export default async function RootLayout({
  children,
  params: { locale = 'ar' },
}: {
  children: React.ReactNode;
  params: { locale?: string };
}) {
  const messages = await getMessages();
  const isRTL = locale === 'ar';

  return (
    <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'} className={`${cairo.variable} ${inter.variable}`}>
      <body className={isRTL ? 'font-[family-name:var(--font-cairo)]' : 'font-[family-name:var(--font-inter)]'}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
