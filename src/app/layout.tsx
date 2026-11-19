import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import localFont from 'next/font/local';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { Providers } from '@/components/providers';
import { PwaLifecycle } from '@/components/pwa/pwa-lifecycle';
import { THEME_BOOT_SCRIPT } from '@/lib/theme';
import './globals.css';

// Self-hosted variable Inter, subset to the RCC Latin UI character set (21.0 KB).
const inter = localFont({
  src: '../styles/inter-rcc-optimized.woff2',
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
    manifest: '/manifest.webmanifest',
    appleWebApp: { capable: true, title: 'RCC', statusBarStyle: 'default' },
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
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#081B35' },
    { media: '(prefers-color-scheme: dark)', color: '#050F20' },
  ],
};

export default async function RootLayout({ children }: { readonly children: ReactNode }) {
  const messages = await getMessages();
  const nav = await getTranslations('nav');
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body>
        {/* Resolves the stored appearance before first paint, so there is no flash. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-surface focus:px-4 focus:py-2 focus:font-semibold focus:text-brand focus:shadow-e2"
        >
          {nav('skip')}
        </a>
        <NextIntlClientProvider messages={messages}>
          <Providers>{children}</Providers>
          <PwaLifecycle />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
