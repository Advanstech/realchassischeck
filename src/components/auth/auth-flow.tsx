'use client';

import { ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Eyebrow } from '@/components/ui/primitives';
import { OtpForm } from '@/components/auth/otp-form';
import type { AuthSession } from '@/lib/auth';

type Mode = 'login' | 'register';

/**
 * OTP sign-in and registration (ACC-03). The API creates the account on the first
 * verified code for a contact, so both modes share one flow; only the copy differs.
 * A buyer whose setup is unfinished lands in the onboarding wizard, which resumes
 * from whatever the server already knows.
 */
export function AuthFlow({ mode, next }: { readonly mode: Mode; readonly next: string }) {
  const t = useTranslations('auth');
  const router = useRouter();
  const trust = t.raw('trust') as ReadonlyArray<string>;
  const isLogin = mode === 'login';

  function handleVerified(session: AuthSession) {
    const setupDone = session.user.name && session.user.intent;
    router.replace(setupDone ? next : `/onboarding?next=${encodeURIComponent(next)}`);
    router.refresh();
  }

  return (
    <section className="mx-auto grid max-w-[1200px] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12 lg:px-8 lg:py-20">
      <div className="hero-canvas hero-grid relative isolate overflow-hidden rounded-sheet p-7 text-on-inverse sm:p-9">
        <Image
          src="/monogram-rcc.png"
          alt=""
          width={727}
          height={197}
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-10 -right-16 h-auto w-[26rem] max-w-none opacity-[0.06]"
        />
        <div className="relative z-10">
          <Eyebrow tone="inverse">{isLogin ? t('loginTitle') : t('registerTitle')}</Eyebrow>
          <h1 className="mt-5 text-h1 font-extrabold text-balance">
            {isLogin ? t('loginTitle') : t('registerTitle')}
          </h1>
          <p className="mt-4 max-w-[44ch] text-body text-on-inverse-muted">
            {isLogin ? t('loginLede') : t('registerLede')}
          </p>
          <ul className="mt-8 flex flex-col gap-4">
            {trust.map((point) => (
              <li key={point} className="flex items-center gap-3 text-small font-medium text-navy-100">
                <span className="grid size-8 shrink-0 place-items-center rounded-full border border-white/15 bg-white/5">
                  <ShieldCheck className="size-4 text-navy-200" aria-hidden="true" />
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="panel-raised p-6 sm:p-8">
        <OtpForm onVerified={handleVerified} />
        <p className="mt-6 text-center text-small text-text-muted">
          <Link href={isLogin ? '/register' : '/login'} className="font-semibold text-link">
            {isLogin ? t('loginSwitch') : t('registerSwitch')}
          </Link>
        </p>
      </div>
    </section>
  );
}