'use client';

import { useTranslations } from 'next-intl';
import type { PreviewPayload } from '@/lib/api';

const LABELS = ['accidents', 'theft', 'title_brands', 'sales', 'recalls', 'service'] as const;

export function RecordChips({ counts }: { readonly counts: PreviewPayload['counts'] }) {
  const t = useTranslations('preview');
  const records = LABELS.flatMap((key) => {
    const count = counts[key];
    return count ? [{ key, count }] : [];
  });
  if (records.length === 0) return null;

  return (
    <section aria-labelledby="record-counts-title">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <h2 id="record-counts-title" className="text-h3 font-bold text-brand">
          {t('recordsTitle')}
        </h2>
        <p className="text-caption text-text-subtle">{t('detailsUnlock')}</p>
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {records.map((record) => (
          <li key={record.key} className="rounded-lg border border-hairline bg-bg-subtle p-4">
            <p className="num text-h1 font-extrabold leading-none text-brand">{record.count}</p>
            <p className="mt-2 text-small font-medium text-text-muted">{t(`counts.${record.key}`)}</p>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-caption text-text-subtle">{t('recordsNote')}</p>
    </section>
  );
}
