'use client';

import { CarFront, Check, Coins } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Chip } from '@/components/ui/primitives';
import type { AccountTab } from './account-tabs';

const ICONS = { garage: CarFront, credits: Coins } as const;

/**
 * Garage and Credits are 1B growth features (G8, G3). Their tabs ship the
 * approved layout (m_account.png) as honest previews — no fake data, no dead
 * controls — until the features themselves pass Gate 1.
 */
export function ComingSoonPanel({ kind }: { readonly kind: Exclude<AccountTab, 'reports'> }) {
  const t = useTranslations('account.preview');
  const points = t.raw(`${kind}Points`) as ReadonlyArray<string>;
  const Icon = ICONS[kind];

  return (
    <section className="panel-raised mt-6 p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-h3 font-bold text-brand">
          <Icon className="size-5 text-text-muted" aria-hidden="true" />
          {t(`${kind}Title`)}
        </h2>
        <Chip tone="info">{t('eyebrow')}</Chip>
      </div>
      <p className="mt-4 max-w-[56ch] text-body text-text-muted">{t(`${kind}Body`)}</p>

      <ul className="mt-5 grid gap-2.5 sm:grid-cols-3">
        {points.map((point) => (
          <li
            key={point}
            className="flex items-start gap-2.5 rounded-lg border border-border bg-bg-subtle p-4 text-small text-text"
          >
            <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
            {point}
          </li>
        ))}
      </ul>

      <p className="mt-5 text-caption text-text-subtle">{t('note')}</p>
    </section>
  );
}
