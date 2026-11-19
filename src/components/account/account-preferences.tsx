'use client';

import { Languages, Palette } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ThemeSwitch } from '@/components/theme/theme-switch';
import type { AuthAccount } from '@/lib/auth';

/** Appearance and language live here, where fintech apps put preferences. */
export function AccountPreferences({ account }: { readonly account: AuthAccount }) {
  const t = useTranslations('account');
  const theme = useTranslations('theme');

  return (
    <section className="panel-raised p-6">
      <h2 className="flex items-center gap-2 text-h3 font-bold text-brand">
        <Palette className="size-5 text-text-muted" aria-hidden="true" />
        {t('preferencesTitle')}
      </h2>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-small font-semibold text-text">{theme('label')}</p>
          <p className="mt-1 text-caption text-text-subtle">{t('appearanceHint')}</p>
        </div>
        <ThemeSwitch showLabels />
      </div>

      <div className="mt-6 border-t border-hairline pt-5">
        <p className="flex items-center gap-2 text-small font-semibold text-text">
          <Languages className="size-4 text-text-muted" aria-hidden="true" />
          {t('languageTitle')}
        </p>
        <p className="mt-2 text-body font-semibold uppercase text-text">{account.language}</p>
        <p className="mt-1 text-caption text-text-subtle">{t('languageNote')}</p>
      </div>
    </section>
  );
}
