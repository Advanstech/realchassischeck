'use client';

import { Check, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion, useReducedMotion } from 'motion/react';
import { buttonClass } from '@/components/ui/button';
import { Chip } from '@/components/ui/primitives';
import type { AuthAccount } from '@/lib/auth';

const INCLUDED = ['saved_reports', 'redownload', 'share_link'] as const;

/** Final reveal: what the buyer unlocked, and the two places to go next. */
export function WizardDone({ account, next }: { readonly account: AuthAccount; readonly next: string }) {
  const t = useTranslations('wizard.done');
  const ta = useTranslations('account');
  const reduced = useReducedMotion();
  const isBusiness = account.intent === 'IMPORTER' || account.intent === 'BUSINESS';

  return (
    <div className="flex flex-col items-start gap-6">
      <motion.span
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: reduced ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
        className="grid size-16 place-items-center rounded-full bg-success-bg text-success-ink"
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" className="size-8" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
          <motion.path
            d="M4 12.5l5 5L20 6.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: reduced ? 0 : 0.4, delay: reduced ? 0 : 0.15, ease: 'easeOut' }}
          />
        </svg>
      </motion.span>

      <div>
        <h2 className="text-h1 font-extrabold text-brand">{t('title', { name: account.name ?? '' })}</h2>
        <p className="mt-2 text-body text-text-muted">{t('lede')}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Chip tone="success">
          <Check className="size-3.5" aria-hidden="true" />
          {ta('levels.REGISTERED')}
        </Chip>
        {isBusiness && account.intent ? (
          <Chip tone="info">
            <Sparkles className="size-3.5" aria-hidden="true" />
            {t('interestChip', { level: ta(`levels.${account.intent}`) })}
          </Chip>
        ) : null}
      </div>

      <ul className="flex flex-col gap-2.5">
        {INCLUDED.map((capability) => (
          <li key={capability} className="flex items-start gap-2.5 text-small text-text">
            <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
            {ta(`capabilities.${capability}`)}
          </li>
        ))}
      </ul>

      {isBusiness && account.intent ? (
        <p className="max-w-[52ch] rounded-lg border border-info/25 bg-info-bg p-4 text-small text-info-ink">
          {t('businessSaved', { level: ta(`levels.${account.intent}`) })}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Link href={next === '/' || next === '/account' ? '/#check' : next} className={buttonClass('primary', 'lg')}>
          {t('checkCta')}
        </Link>
        <Link href="/account" className={buttonClass('secondary', 'lg')}>
          {t('accountCta')}
        </Link>
      </div>
    </div>
  );
}