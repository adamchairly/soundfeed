import type { Metadata } from 'next';
import { Providers } from './providers';
import { Layout } from '@/components/layout/Layout';
import './globals.css';

export const metadata: Metadata = {
  title: 'soundfeed',
  description: 'Follow artists you want to hear',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-display antialiased">
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
