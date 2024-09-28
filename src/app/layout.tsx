import type { Metadata } from 'next';
import localFont from 'next/font/local';

import '@/styles/globals.css';

import { Providers } from '@/app/providers';
import { cn } from '@/lib/utils';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans'
});

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono'
});

export const metadata: Metadata = {
  title: 'Topsun Engenharia',
  description:
    'Transforme suas ideias em diagramas profissionais com facilidade'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={cn(geistSans.variable, geistMono.variable)}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
