import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ShoppingCart, Phone, Store } from 'lucide-react';

async function getVendorBySlug(slug: string) {
  try {
    const vendor = await prisma.vendor.findUnique({
      where: { slug },
      include: {
        products: {
          where: { isVisible: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    return vendor;
  } catch (error) {
    console.error('Error fetching vendor:', error);
    return null;
  }
}

export default async function StorefrontPage() {
  const headersList = headers();
  const vendorSlug = headersList.get('x-vendor-slug');

  if (!vendorSlug) {
    notFound();
  }

  const vendor = await getVendorBySlug(vendorSlug);

  if (!vendor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center px-4 max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Store className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-2">المتجر غير موجود</p>
          <p className="text-lg text-gray-500 mb-8">Store not found</p>
          <Link 
            href="/"
            className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  const themeColor = vendor.themeColor || '#16a34a';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {vendor.logoUrl ? (
                <img 
                  src={vendor.logoUrl} 
                  alt={vendor.storeNameAr}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl"
                  style={{ backgroundColor: themeColor }}
                >
                  {vendor.storeNameAr.charAt(0)}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {vendor.storeNameAr}
                </h1>
                {vendor.storeNameEn && (
                  <p className="text-sm text-gray-600">{vendor.storeNameEn}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <a
                href={`https://wa.me/${vendor.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                <Phone className="w-4 h-4" />
                <span className="hidden sm:inline">اتصل بنا</span>
              </a>
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition">
                <ShoppingCart className="w-6 h-6 text-gray-700" />
                <span className="absolute -top-1 -end-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </button>
            </div>
          </div>

          {vendor.descriptionAr && (
            <p className="mt-4 text-gray-600 text-center">
              {vendor.descriptionAr}
            </p>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">منتجاتنا</h2>
          <p className="text-gray-600">{vendor.products.length} منتج متوفر</p>
        </div>

        {vendor.products.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Store className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              لا توجد منتجات حالياً
            </h3>
            <p className="text-gray-600">سيتم إضافة المنتجات قريباً</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {vendor.products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden group"
              >
                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.nameAr}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Store className="w-16 h-16 text-gray-300" />
                    </div>
                  )}
                  
                  {product.comparePrice && (
                    <div className="absolute top-2 start-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      خصم
                    </div>
                  )}

                  {product.stock <= 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">نفذت الكمية</span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">
                    {product.nameAr}
                  </h3>
                  {product.nameEn && (
                    <p className="text-sm text-gray-500 mb-2 line-clamp-1">
                      {product.nameEn}
                    </p>
                  )}

                  <div className="flex items-center gap-2 mb-3">
                    <span 
                      className="text-2xl font-bold"
                      style={{ color: themeColor }}
                    >
                      {product.price.toFixed(2)} د.أ
                    </span>
                    {product.comparePrice && (
                      <span className="text-sm text-gray-400 line-through">
                        {product.comparePrice.toFixed(2)} د.أ
                      </span>
                    )}
                  </div>

                  <button
                    disabled={product.stock <= 0}
                    className="w-full py-2 rounded-lg font-semibold text-white transition disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                    style={{ backgroundColor: themeColor }}
                  >
                    {product.stock > 0 ? 'أضف للسلة' : 'نفذت الكمية'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-gray-900 text-white py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            مدعوم بواسطة{' '}
            <a 
              href="/" 
              className="text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              جيبو
            </a>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            رسوم التوصيل: {vendor.deliveryFee.toFixed(2)} د.أ
          </p>
        </div>
      </footer>
    </div>
  );
}
