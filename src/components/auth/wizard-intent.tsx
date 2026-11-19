'use client';

import { useMutation } from '@tanstack/react-query';
import { ArrowRight, Building2, Ship, UserRound } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Banner, Chip } from '@/components/ui/primitives';
import { ApiRequestError } from '@/lib/api';
import { updateProfile, type AuthAccount } from '@/lib/auth';
import { cn } from '@/lib/cn';

const OPTIONS = [
  { value: 'PERSONAL', icon: UserRound },
  { value: 'IMPORTER', icon: Ship },
  { value: 'BUSINESS', icon: Building2 },
] as const;

type Intent = (typeof OPTIONS)[number]['value'];

/**
 * Step: which SRS 2.3 class the buyer belongs to. Business answers record
 * interest for the 1B classes; the account itself stays REGISTERED until those
 * ship, and the copy says so before the buyer commits.
 */
export function WizardIntent({
  account,
  onSaved,
}: {
  readonly account: AuthAccount;
  readonly onSaved: (profile: AuthAccount) => void;
}) {
  const t = useTranslations('wizard.intent');
  const levels = useTranslations('account.levels');
  const [selected, setSelected] = useState<Intent>(account.intent ?? 'PERSONAL');
  const [error, setError] = useState<string | null>(null);
  const isBusiness = selected !== 'PERSONAL';

  const save = useMutation({
    mutationFn: () => updateProfile({ intent: selected }),
    onSuccess: onSaved,
    onError: (mutationError) => {
      setError(mutationError instanceof ApiRequestError ? mutationError.message : t('error'));
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-h2 font-extrabold text-brand">{t('title')}</h2>
        <p className="mt-2 max-w-[52ch] text-body text-text-muted">{t('lede')}</p>
      </div>

      <div role="radiogroup" aria-label={t('title')} className="flex flex-col gap-3">
        {OPTIONS.map(({ value, icon: Icon }) => {
          const active = selected === value;
          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => {
                setSelected(value);
                setError(null);
              }}
              className={cn(
                'flex min-h-11 items-start gap-4 rounded-lg border p-4 text-left transition-colors duration-150 focus:outline-none focus:ring-4 focus:ring-brand/10',
                active ? 'border-brand bg-brand/5 shadow-e1' : 'border-border-strong bg-surface hover:border-brand/40',
              )}
            >
              <span
                className={cn(
                  'grid size-10 shrink-0 place-items-center rounded-md',
                  active ? 'bg-brand text-on-brand' : 'bg-bg-subtle text-text-muted',
                )}
              >
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-body font-bold text-text">{t(`options.${value}.title`)}</span>
                  {value !== 'PERSONAL' ? <Chip tone="info">{t('soonChip')}</Chip> : null}
                </span>
                <span className="mt-1 block text-small text-text-muted">{t(`options.${value}.description`)}</span>
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  'mt-1 grid size-5 shrink-0 place-items-center rounded-full border-2',
                  active ? 'border-brand' : 'border-border-strong',
                )}
              >
                {active ? <span className="size-2.5 rounded-full bg-brand" /> : null}
              </span>
            </button>
          );
        })}
      </div>

      <Banner tone="info" title={isBusiness ? t('businessTitle') : t('personalTitle')}>
        {isBusiness ? t('businessNote', { level: levels(selected) }) : t('personalNote')}
      </Banner>

      {error ? <Banner tone="danger" title={error} /> : null}

      <Button size="lg" loading={save.isPending} onClick={() => save.mutate()} className="self-start">
        {save.isPending ? t('saving') : t('continue')}
        {save.isPending ? null : <ArrowRight className="size-5" aria-hidden="true" />}
      </Button>
    </div>
  );
}