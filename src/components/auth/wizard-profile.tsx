'use client';

import { useMutation } from '@tanstack/react-query';
import { ArrowRight, UserRound } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Banner } from '@/components/ui/primitives';
import { ApiRequestError } from '@/lib/api';
import { updateProfile, type AuthAccount } from '@/lib/auth';

const LANGUAGES = ['en', 'tw', 'fr', 'ga', 'ewe', 'ha'] as const;

/** Step: the name reports and receipts carry, plus the preferred language. */
export function WizardProfile({
  account,
  onSaved,
}: {
  readonly account: AuthAccount;
  readonly onSaved: (profile: AuthAccount) => void;
}) {
  const t = useTranslations('wizard.profile');
  const fields = useTranslations('onboarding');
  const [name, setName] = useState(account.name ?? '');
  const [language, setLanguage] = useState(account.language || 'en');
  const [error, setError] = useState<string | null>(null);

  const save = useMutation({
    mutationFn: () => updateProfile({ name: name.trim(), language }),
    onSuccess: onSaved,
    onError: (mutationError) => {
      setError(mutationError instanceof ApiRequestError ? mutationError.message : fields('error'));
    },
  });

  function submit(event: FormEvent) {
    event.preventDefault();
    if (name.trim().length < 2) {
      setError(fields('nameError'));
      return;
    }
    setError(null);
    save.mutate();
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <div>
        <h2 className="text-h2 font-extrabold text-brand">{t('title')}</h2>
        <p className="mt-2 max-w-[52ch] text-body text-text-muted">{t('lede')}</p>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="wizard-name" className="text-small font-semibold text-text">
          {fields('nameLabel')}
        </label>
        <div className="relative">
          <UserRound
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-subtle"
            aria-hidden="true"
          />
          <input
            id="wizard-name"
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            minLength={2}
            maxLength={80}
            autoComplete="name"
            placeholder={fields('namePlaceholder')}
            className="h-12 w-full rounded-md border border-border-strong bg-surface pl-10 pr-3 text-body text-text hover:border-brand/40 focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/10"
          />
        </div>
        <p className="text-caption text-text-subtle">{fields('nameHint')}</p>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="wizard-language" className="text-small font-semibold text-text">
          {fields('languageLabel')}
        </label>
        <select
          id="wizard-language"
          name="language"
          value={language}
          onChange={(event) => setLanguage(event.target.value)}
          className="h-12 w-full rounded-md border border-border-strong bg-surface px-3 text-body text-text hover:border-brand/40 focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/10"
        >
          {LANGUAGES.map((code) => (
            <option key={code} value={code}>
              {fields(`languages.${code}`)}
            </option>
          ))}
        </select>
      </div>

      {error ? <Banner tone="warning" title={error} /> : null}

      <Button type="submit" size="lg" loading={save.isPending} className="self-start">
        {save.isPending ? t('submitting') : t('submit')}
        {save.isPending ? null : <ArrowRight className="size-5" aria-hidden="true" />}
      </Button>
    </form>
  );
}