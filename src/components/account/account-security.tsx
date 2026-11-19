'use client';

import { KeyRound, LogOut, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import type { AuthAccount } from '@/lib/auth';

/** Trust in context: sign-in method and session controls next to each other. */
export function AccountSecurity({
  account,
  isSigningOut,
  onSignOut,
  onSignOutAll,
}: {
  readonly account: AuthAccount;
  readonly isSigningOut: boolean;
  readonly onSignOut: () => void;
  readonly onSignOutAll: () => void;
}) {
  const t = useTranslations('account');
  const methodKey = account.phone ? 'sms' : 'email';
  const contact = account.phone ?? account.email ?? '—';

  return (
    <section className="panel-raised p-6">
      <h2 className="flex items-center gap-2 text-h3 font-bold text-brand">
        <ShieldCheck className="size-5 text-text-muted" aria-hidden="true" />
        {t('securityTitle')}
      </h2>

      <div className="mt-5 flex items-start gap-3 rounded-lg border border-border bg-bg-subtle p-4">
        <KeyRound className="mt-0.5 size-4 shrink-0 text-info" aria-hidden="true" />
        <div>
          <p className="text-caption font-semibold uppercase tracking-[0.08em] text-text-subtle">
            {t('signInMethodLabel')}
          </p>
          <p className="mt-1 text-small font-semibold text-text">{t(`methods.${methodKey}`, { contact })}</p>
        </div>
      </div>

      <p className="mt-4 text-caption text-text-subtle">{t('sessionsNote')}</p>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Button variant="secondary" loading={isSigningOut} onClick={onSignOut}>
          <LogOut className="size-4" aria-hidden="true" />
          {isSigningOut ? t('signingOut') : t('signOut')}
        </Button>
        <Button variant="danger-outline" loading={isSigningOut} onClick={onSignOutAll}>
          {t('signOutAll')}
        </Button>
      </div>
    </section>
  );
}
