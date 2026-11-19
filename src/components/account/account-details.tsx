'use client';

import { PencilLine, UserRound } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { AuthAccount } from '@/lib/auth';

export function AccountDetails({ account }: { readonly account: AuthAccount }) {
  const t = useTranslations('account');
  const contact = account.phone ?? account.email ?? '—';

  return (
    <section className="panel-raised p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-h3 font-bold text-brand">
          <UserRound className="size-5 text-text-muted" aria-hidden="true" />
          {t('detailsTitle')}
        </h2>
        <Link
          href="/onboarding?next=%2Faccount"
          className="flex min-h-11 items-center gap-1.5 text-small font-semibold text-link"
        >
          <PencilLine className="size-4" aria-hidden="true" />
          {t('editProfile')}
        </Link>
      </div>
      <dl className="mt-5 flex flex-col gap-4">
        <div>
          <dt className="text-caption font-semibold uppercase tracking-[0.08em] text-text-subtle">{t('nameLabel')}</dt>
          <dd className="mt-1 text-body font-semibold text-text">{account.name ?? t('nameEmpty')}</dd>
        </div>
        <div>
          <dt className="text-caption font-semibold uppercase tracking-[0.08em] text-text-subtle">{t('contactLabel')}</dt>
          <dd className="mt-1 break-all text-body font-semibold text-text">{contact}</dd>
        </div>
        <div>
          <dt className="text-caption font-semibold uppercase tracking-[0.08em] text-text-subtle">{t('roleLabel')}</dt>
          <dd className="mt-1 text-body font-semibold text-text">{t('roleBuyer')}</dd>
        </div>
        <div>
          <dt className="text-caption font-semibold uppercase tracking-[0.08em] text-text-subtle">{t('levelLabel')}</dt>
          <dd className="mt-1 text-body font-semibold text-text">{t(`levels.${account.level}`)}</dd>
        </div>
        <div>
          <dt className="text-caption font-semibold uppercase tracking-[0.08em] text-text-subtle">{t('languageLabel')}</dt>
          <dd className="mt-1 text-body font-semibold uppercase text-text">{account.language}</dd>
        </div>
      </dl>
    </section>
  );
}
