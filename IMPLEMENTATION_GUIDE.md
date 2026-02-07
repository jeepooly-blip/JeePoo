# JeePoo Implementation Guide

This guide provides step-by-step instructions for completing the JeePoo platform implementation.

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Phase 1: Core Features](#phase-1-core-features)
3. [Phase 2: Advanced Features](#phase-2-advanced-features)
4. [Testing Strategy](#testing-strategy)
5. [Deployment Guide](#deployment-guide)

---

## Quick Start

### What's Already Built

✅ **Infrastructure**
- Next.js 14 project structure
- Prisma database schema
- Middleware for subdomain routing
- i18n setup (Arabic/English)
- Tailwind CSS with RTL support
- Utility functions
- Landing page

### What Needs to Be Built

🔨 **Critical Path (Must Build First)**
1. Authentication system (login/register)
2. Vendor dashboard
3. Product management
4. Storefront pages
5. Shopping cart
6. Checkout flow

🎨 **Enhancement Path (Build After Core)**
1. Image upload system
2. Order management
3. Settings pages
4. Analytics
5. Email notifications

---

## Phase 1: Core Features

### 1. Authentication System

#### Files to Create:

**`src/app/(auth)/login/page.tsx`**
```typescript
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const t = useTranslations('common');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div>
          <h2 className="text-3xl font-bold text-center">{t('login')}</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-2">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              كلمة المرور
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700"
          >
            {t('login')}
          </button>
        </form>
      </div>
    </div>
  );
}
```

**`src/app/api/auth/[...nextauth]/route.ts`**
```typescript
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { prisma } from '@/lib/prisma';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const vendor = await prisma.vendor.findUnique({
          where: { email: credentials.email }
        });

        if (!vendor) {
          return null;
        }

        const isValidPassword = await compare(
          credentials.password,
          vendor.password
        );

        if (!isValidPassword) {
          return null;
        }

        return {
          id: vendor.id,
          email: vendor.email,
          name: vendor.ownerName,
        };
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
```

### 2. Vendor Dashboard

#### Dashboard Layout
**`src/app/(dashboard)/dashboard/layout.tsx`**

Key features:
- Sidebar navigation (Products, Orders, Settings)
- Header with vendor info
- Logout button
- Protected route wrapper

#### Dashboard Home
**`src/app/(dashboard)/dashboard/page.tsx`**

Display:
- Total products count
- Recent orders
- Quick stats
- Quick actions

### 3. Product Management

#### Product List Page
**`src/app/(dashboard)/dashboard/products/page.tsx`**

Features:
- Grid/list view of products
- Search and filter
- Add new product button
- Edit/delete actions

#### Add/Edit Product Page
**`src/app/(dashboard)/dashboard/products/new/page.tsx`**
**`src/app/(dashboard)/dashboard/products/[id]/page.tsx`**

Form fields:
- Arabic name (required)
- English name (optional)
- Arabic description (optional)
- English description (optional)
- Price
- Compare price
- Category dropdown
- Stock quantity
- Image upload
- Visibility toggle

### 4. Storefront

#### Store Homepage
**`src/app/store/[slug]/page.tsx`**

```typescript
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ProductGrid from '@/components/storefront/ProductGrid';
import StoreHeader from '@/components/storefront/StoreHeader';

async function getVendorAndProducts(slug: string) {
  const vendor = await prisma.vendor.findUnique({
    where: { slug },
    include: {
      products: {
        where: { isVisible: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!vendor) {
    notFound();
  }

  return vendor;
}

export default async function StorePage({ params }: { params: { slug: string } }) {
  const vendor = await getVendorAndProducts(params.slug);

  return (
    <div style={{ '--theme-color': vendor.themeColor } as any}>
      <StoreHeader vendor={vendor} />
      <ProductGrid products={vendor.products} locale="ar" />
    </div>
  );
}
```

#### Product Detail Page
**`src/app/store/[slug]/product/[productId]/page.tsx`**

Display:
- Large product image
- Product name and description
- Price
- Add to cart button
- Quantity selector

### 5. Shopping Cart

#### Cart Context
**`src/contexts/CartContext.tsx`**

```typescript
'use client';

import { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
  productId: string;
  name: string;
  nameAr: string;
  nameEn?: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) {
      setItems(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (item: CartItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.productId === item.productId);
      if (existing) {
        return prev.map(i =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  };

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter(i => i.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setItems(prev =>
      prev.map(i =>
        i.productId === productId ? { ...i, quantity } : i
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalAmount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
```

#### Cart Page
**`src/app/store/[slug]/cart/page.tsx`**

Features:
- List of cart items
- Quantity controls
- Remove item button
- Subtotal calculation
- Proceed to checkout button

### 6. Checkout Flow

#### Checkout Page
**`src/app/store/[slug]/checkout/page.tsx`**

Form sections:
1. Customer information (name, phone, address)
2. Order summary
3. Payment method selection
4. Place order button

#### Checkout Logic
```typescript
const handleCheckout = async () => {
  // Validate form
  if (!customerName || !customerPhone || !customerAddress) {
    alert('Please fill all fields');
    return;
  }

  // Create order in database
  const order = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      vendorId: vendor.id,
      customerName,
      customerPhone,
      customerAddress,
      paymentMethod: selectedPayment,
      cartItems: items,
      totalAmount,
      deliveryFee: vendor.deliveryFee,
      orderLocale: locale,
    })
  }).then(res => res.json());

  // Generate WhatsApp message
  const message = generateWhatsAppMessage({
    customerName,
    customerPhone,
    customerAddress,
    cartItems: items,
    totalAmount,
    deliveryFee: vendor.deliveryFee,
    paymentMethod: selectedPayment,
  }, locale);

  // Open WhatsApp
  const whatsappUrl = `https://wa.me/${formatWhatsAppNumber(vendor.whatsappNumber)}?text=${message}`;
  window.open(whatsappUrl, '_blank');

  // Clear cart
  clearCart();
  router.push(`/store/${vendor.slug}/success`);
};
```

---

## Phase 2: Advanced Features

### 1. Image Upload System

**Options:**

#### Option A: Cloudinary
```typescript
// src/lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(file: File, vendorId: string, productId: string) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: `vendors/${vendorId}/products`,
        public_id: productId,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(buffer);
  });
}
```

#### Option B: AWS S3
```typescript
// src/lib/s3.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadToS3(file: File, vendorId: string, productId: string) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: `vendors/${vendorId}/products/${productId}.jpg`,
    Body: buffer,
    ContentType: file.type,
  });

  await s3Client.send(command);
  
  return `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/vendors/${vendorId}/products/${productId}.jpg`;
}
```

### 2. Order Management

#### Order List Page
**`src/app/(dashboard)/dashboard/orders/page.tsx`**

Features:
- Filterable table (by status, date)
- Export to CSV
- Order details modal
- Status update

### 3. Settings Pages

#### Store Settings
**`src/app/(dashboard)/dashboard/settings/page.tsx`**

Sections:
- Store information (name, description)
- Branding (logo, theme color)
- Contact (WhatsApp number)
- Payment (Cliq QR upload)
- Delivery settings

### 4. Vendor Registration

**`src/app/(auth)/register/page.tsx`**

Multi-step form:
1. Business information
2. Owner details
3. Contact and payment
4. Store setup (slug, theme)

---

## Testing Strategy

### Manual Testing Checklist

#### Authentication
- [ ] Vendor can register
- [ ] Vendor can login
- [ ] Vendor can logout
- [ ] Protected routes redirect to login

#### Product Management
- [ ] Create product with Arabic name
- [ ] Create product with English name
- [ ] Upload product image
- [ ] Edit product
- [ ] Delete product
- [ ] Toggle product visibility

#### Storefront
- [ ] Access store via subdomain
- [ ] View product grid
- [ ] View product details
- [ ] Add product to cart
- [ ] Update cart quantities
- [ ] Remove from cart

#### Checkout
- [ ] Fill customer information
- [ ] Select cash payment
- [ ] Select Cliq payment (verify QR displays)
- [ ] Complete order
- [ ] Verify WhatsApp message opens
- [ ] Verify order saved in database

#### Internationalization
- [ ] Switch to English
- [ ] Verify RTL/LTR layout
- [ ] Verify translations
- [ ] Verify product name fallback

---

## Deployment Guide

### 1. Database Setup (Supabase)

1. Create account at supabase.com
2. Create new project
3. Get connection string
4. Update `.env`:
   ```
   DATABASE_URL="postgresql://..."
   ```

### 2. Vercel Deployment

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Configure custom domain:
   - Add `jeepoo.com`
   - Add `*.jeepoo.com` wildcard
5. Deploy

### 3. DNS Configuration

Add these records to your domain:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: *
Value: cname.vercel-dns.com

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 4. Post-Deployment

1. Test main domain: `https://jeepoo.com`
2. Create test vendor
3. Test subdomain: `https://teststore.jeepoo.com`
4. Complete end-to-end order flow

---

## Performance Optimization

### 1. Image Optimization
- Use Next.js Image component
- Enable remote patterns in next.config.js
- Implement lazy loading

### 2. Database Optimization
- Add indexes to frequently queried fields
- Use connection pooling (PgBouncer)
- Implement caching for product lists

### 3. Code Splitting
- Use dynamic imports for heavy components
- Lazy load dashboard modules
- Optimize bundle size

---

## Security Considerations

### 1. Authentication
- Hash passwords with bcrypt (12 rounds)
- Use secure session management
- Implement CSRF protection

### 2. Authorization
- Always filter queries by vendorId
- Validate user owns resource before modification
- Use TypeScript for type safety

### 3. Input Validation
- Validate all form inputs
- Sanitize user-generated content
- Use Zod schemas for API validation

### 4. Environment Variables
- Never commit .env file
- Use different secrets per environment
- Rotate secrets regularly

---

## Next Steps

1. **Week 1**: Authentication + Product Management
2. **Week 2**: Storefront + Shopping Cart
3. **Week 3**: Checkout + WhatsApp Integration
4. **Week 4**: Testing + Deployment

**Priority Order:**
1. Build authentication
2. Build product CRUD
3. Build storefront
4. Build cart & checkout
5. Test end-to-end
6. Deploy to production

---

## Support Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **next-intl**: https://next-intl-docs.vercel.app

---

**Ready to build? Start with authentication!** 🚀
