import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redirect the main domain to English by default
  // You can change '/en' to '/ar' if you want Arabic as default
  redirect('/en');
}
