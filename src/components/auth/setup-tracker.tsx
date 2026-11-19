'use client';

import { ArrowRight, Check, Circle } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { buttonClass } from '@/components/ui/button';
import type { AuthAccount } from '@/lib/auth';
import { cn } from '@/lib/cn';

/**
 * Setup status on the account page: which onboarding answers the server already
 * has, and one tap back into the wizard at the first missing one. Disappears
 * once setup is complete.
 */
export function SetupTracker({ account }: { readonly account: AuthAccount }) {
  const t = useTranslations('account.setup');
  const steps = [
    { key: 'contact', done: true },
    { key: 'intent', done: account.intent !== null },
    { key: 'name', done: account.name !== null },
  ] as const;
  const done = steps.filter((step) => step.done).length;
  if (done === steps.length) return null;

  return (
    <div className="panel-raised mt-6 border-l-4 border-l-warning p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-h3 font-bold text-brand">{t('title')}</h2>
        <p className="text-small font-semibold text-text-muted" aria-live="polite">
          {t('progress', { done, total: steps.length })}
        </p>
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-border" role="presentation">
        <div
          className="h-full rounded-full bg-success transition-[width] duration-[var(--duration-slow)]"
          style={{ width: `${(done / steps.length) * 100}%` }}
        />
      </div>

      <ul className="mt-4 flex flex-col gap-2.5">
        {steps.map((step) => (
          <li key={step.key} className="flex items-center gap-2.5 text-small">
            {step.done ? (
              <Check className="size-4 shrink-0 text-success" aria-hidden="true" />
            ) : (
              <Circle className="size-4 shrink-0 text-text-subtle" aria-hidden="true" />
            )}
            <span className={cn(step.done ? 'text-text-muted line-through decoration-border-strong' : 'font-semibold text-text')}>
              {t(`steps.${step.key}`)}
            </span>
            <span className="sr-only">{step.done ? t('done') : t('pending')}</span>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <Link href="/onboarding?next=%2Faccount" className={buttonClass('secondary', 'md')}>
          {t('continue')}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
        <p className="text-caption text-text-subtle">{t('laterNote')}</p>
      </div>
    </div>
  );
}