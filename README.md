# JeePoo Multi-Vendor SaaS Platform

A scalable multi-tenant SaaS e-commerce platform for small businesses (Groceries, Bakeries, Florists) in Jordan.

## 🎯 Project Overview

JeePoo provides independent subdomain stores (e.g., `store.jeepoo.com`) where vendors manage their own products, images, and pricing. Orders are processed via WhatsApp with Cash or Cliq payments.

### Key Features

- ✅ **Multi-tenant Architecture**: Each vendor gets their own subdomain
- ✅ **Bilingual Support**: Full Arabic/English support with RTL
- ✅ **WhatsApp Integration**: Orders sent directly to vendor's WhatsApp
- ✅ **Flexible Payments**: Cash on delivery or Cliq QR code payments
- ✅ **Vendor Dashboard**: Manage products, orders, and settings
- ✅ **Future-Ready**: Architecture supports marketplace aggregation

## 🛠 Technology Stack

- **Frontend**: Next.js 14 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS with RTL support
- **i18n**: next-intl for Arabic/English
- **Auth**: NextAuth.js v5
- **Hosting**: Vercel + Supabase/Neon

## 📁 Project Structure

```
jeepoo/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout with i18n
│   │   ├── page.tsx           # Landing page
│   │   ├── globals.css        # Global styles
│   │   ├── (auth)/            # Auth routes (login, register)
│   │   ├── (dashboard)/       # Vendor dashboard
│   │   └── store/             # Storefront pages
│   ├── components/            # Reusable components
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client
│   │   └── utils.ts           # Utility functions
│   ├── messages/
│   │   ├── ar.json            # Arabic translations
│   │   └── en.json            # English translations
│   ├── middleware.ts          # Subdomain routing
│   └── i18n.ts               # i18n configuration
├── public/                    # Static assets
├── .env.example              # Environment variables template
├── next.config.js            # Next.js configuration
├── tailwind.config.js        # Tailwind configuration
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database
- (Optional) Cloudinary or AWS S3 account for images

### Installation

1. **Clone and install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your database URL and other credentials:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/jeepoo"
   NEXTAUTH_SECRET="your-secret-key"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

3. **Initialize the database**
   ```bash
   npm run prisma:push
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Main site: http://localhost:3000
   - Test subdomain: http://store.localhost:3000 (requires vendor setup)

## 🗄 Database Schema

The "Glazed Donut" architecture supports isolated vendor data now, with marketplace aggregation capability later.

### Key Tables

#### Vendor
- Stores vendor information (name, branding, contact)
- `isActiveOnMarketplace`: Future flag for marketplace inclusion
- `commissionRate`: Future commission percentage

#### Product
- Bilingual fields (`nameAr`, `nameEn`)
- Vendor-specific pricing and stock
- Category-based organization

#### Order
- Cart snapshot in JSON format
- Payment method tracking (CASH/CLIQ)
- Locale for WhatsApp message generation

## 🌐 Subdomain Routing

The middleware (`src/middleware.ts`) handles subdomain detection:

1. **Main Domain** (`jeepoo.com`): Shows landing page
2. **Vendor Subdomain** (`store.jeepoo.com`): Shows storefront for vendor with slug "store"

### Development Mode
- Use `store.localhost:3000` to test subdomain routing locally
- The middleware injects `x-vendor-slug` header for downstream components

## 🌍 Internationalization

### Default Locale
Arabic (`ar`) is the default language with RTL support.

### Usage in Components
```tsx
import { useTranslations } from 'next-intl';

function MyComponent() {
  const t = useTranslations('common');
  return <button>{t('save')}</button>;
}
```

### Adding Translations
Edit `src/messages/ar.json` and `src/messages/en.json`

## 🎨 Styling Guidelines

### RTL Support
Always use logical properties in Tailwind:

✅ **Correct**:
```tsx
<div className="ms-4 pe-2">  // margin-inline-start, padding-inline-end
```

❌ **Incorrect**:
```tsx
<div className="ml-4 pr-2">  // These don't flip for RTL
```

### Theme Colors
Vendor-specific themes are applied via CSS variables:
```tsx
style={{ '--theme-color': vendor.themeColor }}
```

## 📱 WhatsApp Integration

### Message Format
Orders generate WhatsApp messages with:
- Customer details (name, phone, address)
- Product list with quantities and prices
- Payment method
- Total amount with delivery fee

### URL Generation
```typescript
const whatsappUrl = `https://wa.me/${vendor.whatsappNumber}?text=${encodedMessage}`;
```

## 💳 Payment Methods

### Cash on Delivery
- No additional setup required
- Marked as "PENDING" in database

### Cliq Payment
1. Vendor uploads QR code image (`cliqQRUrl`)
2. Customer scans QR in checkout modal
3. Customer confirms payment manually

## 🔐 Authentication

### Vendor Authentication
- Email/password login
- Session-based with NextAuth.js
- Scoped to vendor data (queries filtered by `vendorId`)

### Routes
- `/login`: Vendor login
- `/register`: New vendor registration
- `/dashboard`: Protected vendor dashboard

## 📊 Vendor Dashboard

The dashboard (`/dashboard`) allows vendors to:

1. **Manage Products**
   - Add/edit/delete products
   - Upload images
   - Set bilingual names and descriptions
   - Manage stock levels

2. **View Orders**
   - See order history
   - Track payment status
   - Export order data

3. **Configure Settings**
   - Update WhatsApp number
   - Upload Cliq QR code
   - Set delivery fees
   - Customize branding (logo, theme color)

## 🛍 Storefront Features

Each vendor's storefront includes:

- **Product Grid**: Displays all visible products
- **Shopping Cart**: Session-based cart management
- **Checkout Flow**: Customer information + payment selection
- **WhatsApp Redirect**: Opens WhatsApp with order details

### Cart State Management
```typescript
// Cart items stored in localStorage
const cart = JSON.parse(localStorage.getItem('cart') || '[]');
```

## 🔮 Future Marketplace Features

The database is designed to support future marketplace aggregation:

```sql
-- Query for marketplace products
SELECT * FROM products 
JOIN vendors ON products.vendorId = vendors.id
WHERE vendors.isActiveOnMarketplace = true;
```

### Commission Calculation
```typescript
const platformFee = orderTotal * vendor.commissionRate;
```

## 🚢 Deployment

### Vercel Deployment

1. **Connect GitHub repository to Vercel**

2. **Add environment variables**
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXT_PUBLIC_APP_URL`
   - Image storage credentials

3. **Configure custom domain**
   - Add `jeepoo.com` and `*.jeepoo.com` to Vercel

4. **Deploy**
   ```bash
   npm run build
   ```

### Database Hosting

**Recommended**: Supabase or Neon for PostgreSQL
- Both offer free tiers
- Built-in connection pooling
- Easy Vercel integration

## 📝 Development Workflow

### Adding a New Vendor (Development)

1. **Create vendor in database**
   ```bash
   npm run prisma:studio
   ```

2. **Add vendor record**
   - Set unique `slug` (e.g., "ammanbakery")
   - Add WhatsApp number
   - Set theme color

3. **Test subdomain**
   - Visit `ammanbakery.localhost:3000`

### Adding a New Feature

1. Update Prisma schema if needed
2. Run `npm run prisma:push`
3. Add translations to `messages/*.json`
4. Implement component with proper i18n
5. Test in both Arabic and English

## 🧪 Testing

### Manual Testing Checklist

- [ ] Create vendor account
- [ ] Add products with Arabic names
- [ ] Test storefront on subdomain
- [ ] Add items to cart
- [ ] Complete checkout flow
- [ ] Verify WhatsApp message format
- [ ] Test Cliq QR code display
- [ ] Switch between Arabic/English
- [ ] Test RTL layout correctness

## 📚 API Routes (To Be Implemented)

- `POST /api/auth/register`: Create vendor account
- `POST /api/auth/login`: Vendor login
- `GET /api/products`: List products (filtered by vendor)
- `POST /api/products`: Create product
- `PUT /api/products/[id]`: Update product
- `DELETE /api/products/[id]`: Delete product
- `POST /api/orders`: Create order
- `GET /api/orders`: List orders (filtered by vendor)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is proprietary. All rights reserved.

## 🆘 Support

For questions or issues:
- Email: support@jeepoo.com
- Documentation: https://docs.jeepoo.com
- Community: https://community.jeepoo.com

## 🎯 Roadmap

### Phase 1 (Current)
- [x] Multi-tenant infrastructure
- [x] Vendor dashboard
- [x] Storefront
- [x] WhatsApp checkout
- [ ] Image upload to cloud storage
- [ ] Vendor registration flow
- [ ] Order management

### Phase 2 (Future)
- [ ] Central marketplace
- [ ] Commission system
- [ ] Logistics integration
- [ ] Analytics dashboard
- [ ] Mobile app
- [ ] Payment gateway integration

---

Built with ❤️ for Jordanian small businesses
