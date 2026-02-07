import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with proper precedence
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format price in Jordanian Dinar
 */
export function formatPrice(price: number, locale: string = 'ar'): string {
  const formatter = new Intl.NumberFormat(locale === 'ar' ? 'ar-JO' : 'en-US', {
    style: 'currency',
    currency: 'JOD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  return formatter.format(price);
}

/**
 * Format phone number for WhatsApp (international format)
 */
export function formatWhatsAppNumber(phone: string): string {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // If it starts with 0, replace with country code 962
  if (cleaned.startsWith('0')) {
    return '962' + cleaned.slice(1);
  }
  
  // If it doesn't start with 962, add it
  if (!cleaned.startsWith('962')) {
    return '962' + cleaned;
  }
  
  return cleaned;
}

/**
 * Generate WhatsApp order message
 */
export function generateWhatsAppMessage(
  order: {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    cartItems: any[];
    totalAmount: number;
    deliveryFee: number;
    paymentMethod: string;
  },
  locale: string = 'ar'
): string {
  const isArabic = locale === 'ar';
  
  let message = '';
  
  if (isArabic) {
    message = `🔴 *طلب جديد من جيبو*\n\n`;
    message += `👤 *الاسم:* ${order.customerName}\n`;
    message += `📱 *الهاتف:* ${order.customerPhone}\n`;
    message += `📍 *العنوان:* ${order.customerAddress}\n\n`;
    message += `🛒 *المنتجات:*\n`;
    
    order.cartItems.forEach((item: any, index: number) => {
      message += `${index + 1}. ${item.nameAr || item.name} x${item.quantity} - ${formatPrice(item.price * item.quantity, locale)}\n`;
    });
    
    message += `\n💰 *المجموع الفرعي:* ${formatPrice(order.totalAmount, locale)}\n`;
    message += `🚚 *رسوم التوصيل:* ${formatPrice(order.deliveryFee, locale)}\n`;
    message += `💵 *المجموع الكلي:* ${formatPrice(order.totalAmount + order.deliveryFee, locale)}\n\n`;
    message += `💳 *طريقة الدفع:* ${order.paymentMethod === 'CASH' ? 'كاش' : 'كليك'}\n`;
  } else {
    message = `🔴 *NEW ORDER from JeePoo*\n\n`;
    message += `👤 *Name:* ${order.customerName}\n`;
    message += `📱 *Phone:* ${order.customerPhone}\n`;
    message += `📍 *Address:* ${order.customerAddress}\n\n`;
    message += `🛒 *Products:*\n`;
    
    order.cartItems.forEach((item: any, index: number) => {
      message += `${index + 1}. ${item.nameEn || item.name} x${item.quantity} - ${formatPrice(item.price * item.quantity, locale)}\n`;
    });
    
    message += `\n💰 *Subtotal:* ${formatPrice(order.totalAmount, locale)}\n`;
    message += `🚚 *Delivery Fee:* ${formatPrice(order.deliveryFee, locale)}\n`;
    message += `💵 *Total:* ${formatPrice(order.totalAmount + order.deliveryFee, locale)}\n\n`;
    message += `💳 *Payment Method:* ${order.paymentMethod === 'CASH' ? 'Cash' : 'Cliq'}\n`;
  }
  
  return encodeURIComponent(message);
}

/**
 * Generate slug from Arabic or English text
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/[^\w\-]+/g, '') // Remove non-word chars except hyphens
    .replace(/\-\-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+/, '') // Trim hyphens from start
    .replace(/-+$/, ''); // Trim hyphens from end
}

/**
 * Validate Jordanian phone number
 */
export function isValidJordanianPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  
  // Should be 10 digits starting with 07, or 12 digits starting with 9627
  return /^07\d{8}$/.test(cleaned) || /^9627\d{8}$/.test(cleaned);
}

/**
 * Get product name based on locale with fallback
 */
export function getLocalizedProductName(
  product: { nameAr: string; nameEn?: string | null },
  locale: string
): string {
  if (locale === 'en' && product.nameEn) {
    return product.nameEn;
  }
  return product.nameAr;
}

/**
 * Get product description based on locale with fallback
 */
export function getLocalizedProductDescription(
  product: { descriptionAr?: string | null; descriptionEn?: string | null },
  locale: string
): string | null {
  if (locale === 'en' && product.descriptionEn) {
    return product.descriptionEn;
  }
  return product.descriptionAr || null;
}
