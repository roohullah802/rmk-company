'use client';

import { usePathname } from 'next/navigation';
import PublicNavbar from './public/PublicNavbar';
import PublicFooter from './public/PublicFooter';

export default function RootLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Don't show navbar/footer for dashboard, sign-in, sign-up
  const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up');
  
  if (isProtectedRoute) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-white">
      <PublicNavbar />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
}
