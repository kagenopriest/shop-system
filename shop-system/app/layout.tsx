import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ElectronInit from '@/components/ElectronInit';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ShopMaster - Premium Shop Management',
  description: 'Manage your inventory, sales, and billing with ease.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen bg-background text-foreground antialiased">
          <ElectronInit />
          {children}
        </main>
      </body>
    </html>
  );
}
