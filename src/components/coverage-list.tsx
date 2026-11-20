'use client';

import { AlertCircle, CheckCircle2, MinusCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { PreviewPayload } from '@/lib/api';

export function CoverageList({ sources }: { readonly sources: PreviewPayload['coverage'] }) {
  const t = useTranslations('preview');

  return (
    <section aria-labelledby="coverage-title" className="panel-raised p-5 sm:p-6">
      <h2 id="coverage-title" className="text-h3 font-bold text-brand">
        {t('coverageTitle')}
      </h2>
      <p className="mt-1.5 text-small text-text-muted">{t('coverageNote')}</p>
      <ul className="mt-4 divide-y divide-hairline">
        {sources.map((source) => {
          const checked = source.status === 'checked';
          const unavailable = source.status === 'unavailable';
          const Icon = checked ? CheckCircle2 : unavailable ? AlertCircle : MinusCircle;
          return (
            <li key={`${source.name}-${source.country}`} className="flex items-start gap-3 py-3">
              <Icon
                className={
                  checked ? 'mt-0.5 size-5 shrink-0 text-success' : unavailable ? 'mt-0.5 size-5 shrink-0 text-warning' : 'mt-0.5 size-5 shrink-0 text-text-subtle'
                }
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <p className="font-semibold text-text">{source.name}</p>
                  <p className="text-caption text-text-subtle">{source.country}</p>
                </div>
                <p className="mt-0.5 text-small font-medium text-text-muted">
                  {checked
                    ? `${t('coverage.checked')}${source.records === undefined ? '' : ` · ${t('coverage.records', { count: source.records })}`}`
                    : unavailable
                      ? t('coverage.unavailable')
                      : t('coverage.notCovered')}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
