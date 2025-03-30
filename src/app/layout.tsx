import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import '@/styles/globals.css';

import { Providers } from '@/app/providers';
import { cn } from '@/lib/utils';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: 'Topsun Engenharia',
  description: 'Transforme suas ideias em diagramas profissionais com facilidade'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.variable}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
