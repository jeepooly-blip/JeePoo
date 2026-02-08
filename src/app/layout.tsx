import type { Metadata } from 'next';
// Ensure you import your global CSS file!
import './globals.css'; 

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
  return (
    // Next.js REQUIRES these HTML and BODY tags here
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
