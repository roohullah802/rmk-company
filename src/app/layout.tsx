import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'RMK — Heavy Machinery & Excavation Experts',
    template: '%s | RMK',
  },
  description:
    'RMK is a leading heavy machinery company powering Pakistan\'s largest construction projects with 30+ excavators and expert workforce.',
  keywords: ['excavator', 'heavy machinery', 'construction', 'RMK', 'Pakistan'],
  openGraph: {
    title: 'RMK — Heavy Machinery & Excavation Experts',
    description: 'Powering Pakistan\'s largest construction projects.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={inter.variable}>
        <body className="bg-zinc-950 text-white antialiased">{children}</body>
      </html>
    </ClerkProvider>
  );
}
