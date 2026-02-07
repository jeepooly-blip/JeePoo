# JeePoo Quick Reference Guide

Quick snippets and patterns for common development tasks.

## 🔄 Common Commands

```bash
# Development
npm run dev                 # Start dev server
npm run build              # Build for production
npm run start              # Start production server

# Database
npm run prisma:generate    # Generate Prisma client
npm run prisma:push        # Push schema to database
npm run prisma:studio      # Open Prisma Studio GUI

# Linting
npm run lint              # Run ESLint
```

## 📝 Code Snippets

### Fetch Vendor Data (Server Component)

```typescript
import { prisma } from '@/lib/prisma';

const vendor = await prisma.vendor.findUnique({
  where: { id: vendorId },
  include: {
    products: true,
    orders: true,
  }
});
```

### Fetch Products (Server Component)

```typescript
const products = await prisma.product.findMany({
  where: {
    vendorId: session.user.id,
    isVisible: true,
  },
  orderBy: {
    createdAt: 'desc',
  }
});
```

### Create Product (API Route)

```typescript
// app/api/products/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  
  const product = await prisma.product.create({
    data: {
      vendorId: session.user.id,
      nameAr: body.nameAr,
      nameEn: body.nameEn,
      price: parseFloat(body.price),
      category: body.category,
      stock: parseInt(body.stock),
    }
  });

  return NextResponse.json(product);
}
```

### Using Translations (Client Component)

```typescript
'use client';

import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('common');
  const ts = useTranslations('storefront');
  
  return (
    <div>
      <h1>{t('products')}</h1>
      <button>{ts('addToCart')}</button>
    </div>
  );
}
```

### Using Cart Context

```typescript
'use client';

import { useCart } from '@/contexts/CartContext';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  
  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.nameEn || product.nameAr,
      nameAr: product.nameAr,
      nameEn: product.nameEn,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl,
    });
  };
  
  return (
    <button onClick={handleAddToCart}>
      Add to Cart
    </button>
  );
}
```

### Protected Route (Server Component)

```typescript
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

export default async function DashboardPage() {
  const session = await getServerSession();
  
  if (!session) {
    redirect('/login');
  }
  
  return <div>Dashboard content...</div>;
}
```

### Form with Loading State (Client Component)

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProductForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      nameAr: formData.get('nameAr'),
      price: formData.get('price'),
      // ... other fields
    };
    
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        router.push('/dashboard/products');
        router.refresh(); // Refresh server components
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'جاري الحفظ...' : 'حفظ'}
      </button>
    </form>
  );
}
```

### Image Upload Handler

```typescript
'use client';

import { useState } from 'react';

export default function ImageUpload({ onUpload }) {
  const [uploading, setUploading] = useState(false);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const { url } = await response.json();
      onUpload(url);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
      />
      {uploading && <p>جاري الرفع...</p>}
    </div>
  );
}
```

### WhatsApp Link Generator

```typescript
import { formatWhatsAppNumber, generateWhatsAppMessage } from '@/lib/utils';

const whatsappUrl = `https://wa.me/${formatWhatsAppNumber(vendor.whatsappNumber)}?text=${generateWhatsAppMessage(orderData, 'ar')}`;

// Open in new tab
window.open(whatsappUrl, '_blank');

// Or use Link component
<Link href={whatsappUrl} target="_blank">
  Send Order
</Link>
```

### Format Price Display

```typescript
import { formatPrice } from '@/lib/utils';

// In component
<p>{formatPrice(product.price, locale)}</p>

// Output in Arabic: "١٥٫٠٠ د.أ"
// Output in English: "JOD 15.00"
```

### Get Localized Product Name

```typescript
import { getLocalizedProductName } from '@/lib/utils';

const displayName = getLocalizedProductName(product, locale);
// Returns nameEn if locale is 'en' and nameEn exists
// Otherwise returns nameAr (fallback)
```

## 🎨 Styling Patterns

### RTL-Safe Container

```tsx
<div className="container mx-auto px-4 sm:px-6 lg:px-8">
  {/* Content */}
</div>
```

### RTL-Safe Grid

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Items */}
</div>
```

### RTL-Safe Flex with Spacing

```tsx
// Use inline-start and inline-end
<div className="flex items-center gap-4">
  <div className="ms-auto">Right in LTR, Left in RTL</div>
</div>
```

### Card Component

```tsx
<div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition">
  {/* Card content */}
</div>
```

### Button Styles

```tsx
// Primary button
<button className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition">
  {text}
</button>

// Secondary button
<button className="border-2 border-emerald-600 text-emerald-600 px-6 py-2 rounded-lg hover:bg-emerald-50 transition">
  {text}
</button>

// Danger button
<button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition">
  {text}
</button>
```

### Form Input

```tsx
<div className="space-y-2">
  <label className="block text-sm font-medium text-gray-700">
    {label}
  </label>
  <input
    type="text"
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
    placeholder={placeholder}
  />
</div>
```

## 🔐 Authentication Patterns

### Protect API Route

```typescript
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const session = await getServerSession();
  
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  // Continue with logic...
}
```

### Get Current Vendor

```typescript
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function getCurrentVendor() {
  const session = await getServerSession();
  if (!session?.user?.id) return null;
  
  return prisma.vendor.findUnique({
    where: { id: session.user.id }
  });
}
```

### Client-Side Session

```typescript
'use client';

import { useSession } from 'next-auth/react';

export default function MyComponent() {
  const { data: session, status } = useSession();
  
  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'unauthenticated') return <div>Please log in</div>;
  
  return <div>Welcome {session?.user?.name}</div>;
}
```

## 📊 Data Fetching Patterns

### Fetch with Error Handling

```typescript
async function getProducts(vendorId: string) {
  try {
    const products = await prisma.product.findMany({
      where: { vendorId },
    });
    return products;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}
```

### Client-Side Fetch with SWR Pattern

```typescript
'use client';

import { useState, useEffect } from 'react';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, []);
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {products.map(product => (
        <div key={product.id}>{product.nameAr}</div>
      ))}
    </div>
  );
}
```

## 🛒 Shopping Cart Patterns

### Add to Cart with Toast

```typescript
'use client';

import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';

export default function AddToCartButton({ product }) {
  const { addItem } = useCart();
  const [showToast, setShowToast] = useState(false);
  
  const handleClick = () => {
    addItem({
      productId: product.id,
      name: product.nameEn || product.nameAr,
      nameAr: product.nameAr,
      nameEn: product.nameEn,
      price: product.price,
      quantity: 1,
    });
    
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };
  
  return (
    <>
      <button onClick={handleClick}>Add to Cart</button>
      {showToast && (
        <div className="fixed bottom-4 end-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg">
          تمت الإضافة للسلة
        </div>
      )}
    </>
  );
}
```

## 🔍 Search and Filter

### Simple Product Search

```typescript
const [search, setSearch] = useState('');

const filteredProducts = products.filter(product =>
  product.nameAr.toLowerCase().includes(search.toLowerCase()) ||
  product.nameEn?.toLowerCase().includes(search.toLowerCase())
);
```

### Category Filter

```typescript
const [selectedCategory, setSelectedCategory] = useState('all');

const filteredProducts = selectedCategory === 'all'
  ? products
  : products.filter(p => p.category === selectedCategory);
```

## 📱 Responsive Patterns

### Mobile Navigation

```tsx
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

return (
  <>
    {/* Mobile menu button */}
    <button
      className="md:hidden"
      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
    >
      Menu
    </button>
    
    {/* Mobile menu */}
    {mobileMenuOpen && (
      <div className="md:hidden">
        {/* Menu items */}
      </div>
    )}
    
    {/* Desktop menu */}
    <div className="hidden md:flex">
      {/* Menu items */}
    </div>
  </>
);
```

## 🎯 Useful Tips

### Force Server Refresh

```typescript
import { useRouter } from 'next/navigation';

const router = useRouter();

// After mutation
router.refresh(); // Revalidates server components
```

### Conditional Rendering

```tsx
// Show different content based on locale
{locale === 'ar' ? (
  <ArabicContent />
) : (
  <EnglishContent />
)}

// Show with optional chaining
{product.nameEn && <p>{product.nameEn}</p>}

// Show with fallback
<p>{product.nameEn || product.nameAr}</p>
```

### Date Formatting

```typescript
// Format date for display
const formattedDate = new Date(order.createdAt).toLocaleDateString('ar-JO', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});
```

---

## 🐛 Common Issues & Solutions

### Issue: Subdomain not working locally
**Solution**: Use `store.localhost:3000` instead of `store.127.0.0.1:3000`

### Issue: RTL layout broken
**Solution**: Ensure `dir` attribute is set on `<html>` tag in layout

### Issue: Images not loading
**Solution**: Add domain to `next.config.js` remotePatterns

### Issue: Translations not updating
**Solution**: Restart dev server after changing JSON files

### Issue: Prisma client outdated
**Solution**: Run `npm run prisma:generate`

---

## 📚 Additional Resources

- [Next.js Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [Prisma CRUD](https://www.prisma.io/docs/concepts/components/prisma-client/crud)
- [next-intl Usage](https://next-intl-docs.vercel.app/docs/usage/messages)
- [Tailwind CSS Cheat Sheet](https://nerdcave.com/tailwind-cheat-sheet)

---

**Happy coding! 🚀**
