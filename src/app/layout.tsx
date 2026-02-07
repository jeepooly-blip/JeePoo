import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JeePoo - Multi-Vendor E-Commerce Platform',
  description: 'Launch your online store in minutes - For bakeries, groceries, and florists in Jordan',
  keywords: ['e-commerce', 'jordan', 'bakery', 'grocery', 'florist', 'online store'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
