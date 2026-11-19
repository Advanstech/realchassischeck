'use client';

import { ArrowLeft, LockKeyhole } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useActionState } from 'react';
import { signIn, type LoginState } from '@/app/admin/actions';
import { buttonClass } from '@/components/ui/button';

const INITIAL: LoginState = { error: null };

/**
 * Rendered instead of the console whenever the API has no valid staff session, so
 * no admin markup reaches an unauthenticated browser. The API owns the password
 * check and lockout; this form only carries them.
 */
export function StaffLogin() {
  const t = useTranslations('admin.login');
  const brand = useTranslations('brand');
  const pathname = usePathname();
  const [state, action, pending] = useActionState(signIn, INITIAL);

  const error =
    state.error === 'invalid'
      ? state.attemptsRemaining === undefined
        ? t('errorInvalid')
        : t('errorAttempts', { count: state.attemptsRemaining })
      : state.error === 'locked'
        ? t('errorLocked', { seconds: state.retryAfterSeconds ?? 900 })
        : state.error === 'suspended'
          ? t('errorSuspended')
          : state.error === 'network'
            ? t('errorNetwork')
            : null;

  return (
    <main id="main" className="rail-canvas relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div aria-hidden="true" className="aperture absolute -top-40 right-[-10%] size-[34rem] rounded-full" />

      <div className="relative w-full max-w-[26rem]">
        <Link href="/" className="flex items-center gap-3 text-on-inverse no-underline">
          <Image src="/monogram-rcc.png" alt="" width={727} height={197} style={{ height: 34, width: 'auto' }} />
          <span className="text-small font-semibold tracking-tight">{brand('name')}</span>
        </Link>

        <div className="mt-6 rounded-xl border border-white/15 bg-surface p-6 shadow-e4">
          <span className="grid size-11 place-items-center rounded-md bg-bg-subtle text-brand">
            <LockKeyhole className="size-5" aria-hidden="true" />
          </span>

          <h1 className="mt-4 text-h2 font-extrabold text-brand">{t('title')}</h1>
          <p className="mt-2 text-small text-text-muted">{t('lede')}</p>

          <form action={action} className="mt-6 flex flex-col gap-4">
            <input type="hidden" name="next" value={pathname} />
            <div className="flex flex-col gap-2">
              <label htmlFor="staff-email" className="text-small font-semibold text-text">
                {t('email')}
              </label>
              <input
                id="staff-email"
                name="email"
                type="email"
                required
                autoComplete="username"
                inputMode="email"
                aria-invalid={error ? true : undefined}
                className="h-12 w-full rounded-md border border-border-strong bg-surface px-3 text-small text-text hover:border-brand/40 focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/10"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="staff-password" className="text-small font-semibold text-text">
                {t('password')}
              </label>
              <input
                id="staff-password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                aria-describedby="staff-password-hint"
                aria-invalid={error ? true : undefined}
                className="h-12 w-full rounded-md border border-border-strong bg-surface px-3 text-small text-text hover:border-brand/40 focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/10"
              />
              <p id="staff-password-hint" className="text-caption text-text-subtle">
                {t('hint')}
              </p>
            </div>

            {error ? (
              <p role="alert" className="rounded-md border border-danger/25 bg-danger-bg p-3 text-small text-danger-ink">
                {error}
              </p>
            ) : null}

            <button type="submit" disabled={pending} className={buttonClass('primary', 'lg', 'w-full')}>
              {pending ? t('submitting') : t('submit')}
            </button>
          </form>
        </div>

        <div className="mt-5 flex items-center justify-between gap-4 text-caption text-navy-300">
          <Link href="/" className="flex min-h-11 items-center gap-1.5 text-navy-200 no-underline hover:text-white">
            <ArrowLeft className="size-4" aria-hidden="true" />
            {t('back')}
          </Link>
          <span>{t('note')}</span>
        </div>
      </div>
    </main>
  );
}
