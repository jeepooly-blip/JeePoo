import { redirect } from 'next/navigation';

export default function RootPage() {
  // This handles the root URL "/"
  redirect('/en');
}
