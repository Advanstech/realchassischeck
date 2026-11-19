'use client';

import { AlertTriangle, RotateCcw } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { buttonClass } from '@/components/ui/button';

/**
 * Route-level failure fallback. Next's default is a white page, which looks like
 * the product broke; this keeps the brand and gives one clear action.
 */
export default function RouteError({ reset }: { readonly error: Error & { digest?: string }; readonly reset: () => void }) {
  const t = useTranslations('errors');

  return (
    <main id="main" className="flex min-h-screen items-center justify-center bg-bg-subtle px-4 py-16">
      <div className="w-full max-w-[30rem]">
        <Link href="/" className="flex items-center gap-3 no-underline">
          <Image src="/icon-192.png" alt="" width={34} height={34} className="size-[34px] rounded-md" />
          <span className="text-small font-bold text-brand">Real Chassis Check</span>
        </Link>

        <div className="panel mt-6 p-6">
          <span className="grid size-11 place-items-center rounded-md bg-danger-bg text-danger-ink">
            <AlertTriangle className="size-5" aria-hidden="true" />
          </span>
          <h1 className="mt-4 text-h2 font-extrabold text-brand">{t('title')}</h1>
          <p className="mt-2 text-small text-text-muted">{t('body')}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={reset} className={buttonClass('primary', 'md')}>
              <RotateCcw className="size-4" aria-hidden="true" />
              {t('retry')}
            </button>
            <Link href="/" className={buttonClass('secondary', 'md')}>
              {t('home')}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
