'use client';

import { FileText, ScanLine, Wallet, FolderCheck } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { buttonClass } from '@/components/ui/button';

const STEPS = [
  { key: 'check', icon: ScanLine },
  { key: 'pay', icon: Wallet },
  { key: 'saved', icon: FolderCheck },
] as const;

/**
 * The account's main job: past reports and the next check. Until the order
 * module lands, the panel teaches what will appear here and offers the one
 * red action on the screen.
 */
export function ReportsPanel() {
  const t = useTranslations('account.reports');

  return (
    <section className="panel-raised mt-6 p-6 sm:p-8">
      <h2 className="text-h3 font-bold text-brand">{t('title')}</h2>
      <p className="mt-2 max-w-[52ch] text-small text-text-muted">{t('lede')}</p>

      <div className="mt-5 rounded-lg border border-dashed border-border-strong bg-bg-subtle p-6 sm:p-8">
        <FileText className="size-10 text-text-subtle" aria-hidden="true" />
        <h3 className="mt-4 text-h3 font-bold text-text">{t('emptyTitle')}</h3>
        <p className="mt-2 max-w-[46ch] text-small text-text-muted">{t('emptyBody')}</p>

        <p className="mt-6 text-caption font-semibold uppercase tracking-[0.08em] text-text-subtle">
          {t('stepsTitle')}
        </p>
        <ol className="mt-3 flex flex-col gap-3">
          {STEPS.map(({ key, icon: Icon }, index) => (
            <li key={key} className="flex items-center gap-3 text-small text-text">
              <span
                className="num grid size-7 shrink-0 place-items-center rounded-full border border-border-strong bg-surface text-caption font-bold text-text-muted"
                aria-hidden="true"
              >
                {index + 1}
              </span>
              <Icon className="size-4 shrink-0 text-text-subtle" aria-hidden="true" />
              {t(`steps.${key}`)}
            </li>
          ))}
        </ol>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/#check" className={buttonClass('primary', 'md')}>
            {t('checkCta')}
          </Link>
          <Link href="/#report" className={buttonClass('secondary', 'md')}>
            {t('sampleCta')}
          </Link>
        </div>
      </div>
    </section>
  );
}
