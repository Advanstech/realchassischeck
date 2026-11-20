'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { AccountDetails } from '@/components/account/account-details';
import { AccountHero } from '@/components/account/account-hero';
import { AccountPreferences } from '@/components/account/account-preferences';
import { AccountSecurity } from '@/components/account/account-security';
import { AccountTabs } from '@/components/account/account-tabs';
import { Reveal } from '@/components/account/reveal';
import { SupportStrip } from '@/components/account/support-strip';
import { BuyerLevelCard } from '@/components/auth/buyer-level-card';
import { SetupTracker } from '@/components/auth/setup-tracker';
import { Banner } from '@/components/ui/primitives';
import { useAuth } from '@/lib/use-auth';

/**
 * Signed-in account area (ACC-05), redesigned against the m_account.png
 * mockup: full-bleed greeting, Reports/Garage/Credits tabs, then details,
 * preferences, security and the buyer level. Reports populate from the order
 * module (M2); Garage and Credits are honest 1B previews.
 */
export function AccountView() {
  const t = useTranslations('account');
  const router = useRouter();
  const { account, isPending, isError, signOut, signOutAll, isSigningOut } = useAuth();
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!isPending && !account && !isError && !leaving) router.replace('/login?next=/account');
  }, [isPending, account, isError, leaving, router]);

  if (isPending) {
    return (
      <div className="mx-auto w-full max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="panel-raised h-40 animate-pulse bg-bg-subtle" aria-hidden="true" />
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="panel-raised h-64 animate-pulse bg-bg-subtle" aria-hidden="true" />
          <div className="panel-raised h-64 animate-pulse bg-bg-subtle" aria-hidden="true" />
        </div>
      </div>
    );
  }

  if (isError || !account) {
    return (
      <div className="mx-auto w-full max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8">
        <Banner tone="warning" title={t('loadError')}>
          <Link href="/login?next=/account" className="font-semibold underline">
            {t('signInAgain')}
          </Link>
        </Banner>
      </div>
    );
  }

  async function handleSignOut(all: boolean) {
    setLeaving(true);
    try {
      if (all) await signOutAll();
      else await signOut();
      router.replace('/');
      router.refresh();
    } catch {
      router.replace('/login');
    }
  }

  return (
    <>
      <AccountHero account={account} />

      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <SetupTracker account={account} />
        <AccountTabs />

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-2">
          <Reveal>
            <AccountDetails account={account} />
          </Reveal>
          <Reveal delay={0.08}>
            <div className="flex flex-col gap-6">
              <AccountPreferences account={account} />
              <AccountSecurity
                account={account}
                isSigningOut={isSigningOut}
                onSignOut={() => handleSignOut(false)}
                onSignOutAll={() => handleSignOut(true)}
              />
            </div>
          </Reveal>
        </div>

        <Reveal>
          <BuyerLevelCard level={account.level} />
        </Reveal>
      </div>

      <Reveal>
        <SupportStrip />
      </Reveal>
    </>
  );
}
