'use client';

import { UserRound } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/lib/use-auth';
import { cn } from '@/lib/cn';

/**
 * Header account state. The session query is shared with the account page, so a
 * sign-in or sign-out anywhere updates the header without a full reload.
 */
export function AuthNav({ variant = 'header' }: { readonly variant?: 'header' | 'sheet' }) {
  const t = useTranslations('nav');
  const { account, isPending } = useAuth();

  if (variant === 'sheet') {
    return (
      <div className="flex flex-col">
        {account ? (
          <Link href="/account" className="flex min-h-14 items-center gap-3 border-b border-hairline font-semibold text-brand no-underline">
            <UserRound className="size-5 text-text-muted" aria-hidden="true" />
            {t('account')}
          </Link>
        ) : (
          <>
            <Link href="/login" className="flex min-h-14 items-center border-b border-hairline font-semibold text-brand no-underline">
              {t('signIn')}
            </Link>
            <Link href="/register" className="flex min-h-14 items-center border-b border-hairline font-semibold text-brand no-underline">
              {t('createAccount')}
            </Link>
          </>
        )}
      </div>
    );
  }

  const label = account ? (account.name ?? t('account')) : t('signIn');
  const href = account ? '/account' : '/login';

  return (
    <Link
      href={href}
      aria-busy={isPending || undefined}
      className={cn(
        'hidden min-h-11 items-center gap-2 rounded-sm px-3 text-small font-medium text-navy-100 no-underline transition-colors duration-150 hover:text-white md:inline-flex',
      )}
    >
      {account ? <UserRound className="size-4" aria-hidden="true" /> : null}
      <span className="max-w-[10rem] truncate">{label}</span>
    </Link>
  );
}
