import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import localFont from 'next/font/local';
import { getTranslations } from 'next-intl/server';
import { Providers } from '@/components/providers';
import './globals.css';

// Self-hosted variable Inter, subset to the RCC Latin UI character set (24.7 KB).
const inter = localFont({
  src: '../styles/inter-rcc.woff2',
  variable: '--font-inter',
  display: 'swap',
  weight: '100 900',
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('brand');
  return {
    title: { default: t('name'), template: `%s · ${t('name')}` },
    description: t('tagline'),
    applicationName: t('name'),
    icons: {
      icon: [
        { url: '/favicon.ico' },
        { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicon-48.png', sizes: '48x48', type: 'image/png' },
      ],
      apple: '/apple-touch-icon.png',
    },
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#081B35',
};

export default function RootLayout({ children }: { readonly children: ReactNode }) {
  return (
    <html lang="en" data-theme="light" className={inter.variable}>
      <body><Providers>{children}</Providers></body>
    </html>
  );
}
