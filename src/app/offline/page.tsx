import { WifiOff } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { buttonClass } from '@/components/ui/button';
import { Eyebrow } from '@/components/ui/primitives';

export const metadata: Metadata = {
  title: 'Offline',
  robots: { index: false, follow: false },
};

export default async function OfflinePage() {
  const t = await getTranslations('offline');
  const brand = await getTranslations('brand');

  return (
    <main id="main" className="flex min-h-screen items-center justify-center bg-bg-subtle px-4 py-16">
      <section className="w-full max-w-[32rem]">
        <Link href="/" className="flex items-center gap-3 no-underline">
          <Image src="/icon-192.png" alt="" width={36} height={36} unoptimized className="size-9 rounded-md" />
          <span className="text-small font-bold text-brand">{brand('name')}</span>
        </Link>

        <div className="panel-raised mt-6 p-6 sm:p-8">
          <span className="grid size-12 place-items-center rounded-lg bg-warning-bg text-warning-ink">
            <WifiOff className="size-6" aria-hidden="true" />
          </span>
          <Eyebrow className="mt-5">{t('eyebrow')}</Eyebrow>
          <h1 className="mt-3 text-h1 font-extrabold text-balance text-brand">{t('title')}</h1>
          <p className="mt-4 text-body text-text-muted">{t('body')}</p>
          <Link href="/" className={buttonClass('primary', 'lg', 'mt-7 w-full sm:w-auto')}>
            {t('retry')}
          </Link>
        </div>
      </section>
    </main>
  );
}
