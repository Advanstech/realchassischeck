'use client';

import { Check, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Chip, Eyebrow } from '@/components/ui/primitives';
import type { AuthAccount } from '@/lib/auth';

type Level = AuthAccount['level'];
type Capability =
  | 'preview'
  | 'purchase'
  | 'saved_reports'
  | 'redownload'
  | 'share_link'
  | 'pack_pricing'
  | 'priority_support'
  | 'price_lists'
  | 'team_users';

// Display copy of the SRS 2.3 matrix; the API enforces the real one.
const LEVEL_CAPABILITIES: Readonly<Record<Level, readonly Capability[]>> = {
  GUEST: ['preview', 'purchase'],
  REGISTERED: ['preview', 'purchase', 'saved_reports', 'redownload', 'share_link'],
  IMPORTER: ['preview', 'purchase', 'saved_reports', 'redownload', 'share_link', 'pack_pricing', 'priority_support'],
  BUSINESS: ['preview', 'purchase', 'saved_reports', 'redownload', 'share_link', 'pack_pricing', 'price_lists', 'team_users'],
};

const BUSINESS_LEVELS: readonly Level[] = ['IMPORTER', 'BUSINESS'];

/** What the buyer's level includes today, and what arrives with the business classes in 1B. */
export function BuyerLevelCard({ level }: { readonly level: Level }) {
  const t = useTranslations('account');
  const included = LEVEL_CAPABILITIES[level];

  return (
    <div className="panel-raised mt-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Eyebrow>{t('levelTitle')}</Eyebrow>
          <h2 className="mt-2 text-h3 font-bold text-brand">{t(`levels.${level}`)}</h2>
        </div>
        <Chip tone={level === 'GUEST' ? 'neutral' : 'success'}>{t(`levelPhase.${level}`)}</Chip>
      </div>

      <p className="mt-4 text-caption font-semibold uppercase tracking-[0.08em] text-text-subtle">
        {t('levelIncludes')}
      </p>
      <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
        {included.map((capability) => (
          <li key={capability} className="flex items-start gap-2.5 text-small text-text">
            <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
            {t(`capabilities.${capability}`)}
          </li>
        ))}
      </ul>

      <div className="mt-6 rounded-lg border border-border bg-bg-subtle p-4">
        <p className="flex items-center gap-2 text-small font-semibold text-text">
          <Sparkles className="size-4 text-info" aria-hidden="true" />
          {t('businessSoonTitle')}
        </p>
        <ul className="mt-3 flex flex-col gap-2">
          {BUSINESS_LEVELS.map((business) => (
            <li key={business} className="text-small text-text-muted">
              <span className="font-semibold text-text">{t(`levels.${business}`)}</span>
              {' — '}
              {t(`levelDescriptions.${business}`)}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-caption text-text-subtle">{t('businessSoon')}</p>
      </div>
    </div>
  );
}