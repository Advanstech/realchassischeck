'use client';

import { LifeBuoy, MessageCircleQuestion } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Chip } from '@/components/ui/primitives';

/** Plain-language support path; WhatsApp opens with launch (Q11). */
export function SupportStrip() {
  const t = useTranslations('account');

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8">
      <div className="panel-raised flex flex-wrap items-center justify-between gap-6 p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-info-bg text-info-ink">
            <LifeBuoy className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-h3 font-bold text-brand">{t('supportTitle')}</h2>
            <p className="mt-1 max-w-[52ch] text-small text-text-muted">{t('supportBody')}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/#faq" className="flex min-h-11 items-center gap-2 text-small font-semibold text-link">
            <MessageCircleQuestion className="size-4" aria-hidden="true" />
            {t('supportFaq')}
          </Link>
          <Chip tone="info">{t('supportWhatsApp')}</Chip>
        </div>
      </div>
    </section>
  );
}
