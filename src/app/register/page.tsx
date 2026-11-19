import type { Metadata } from 'next';
import { OnboardingWizard } from '@/components/auth/onboarding-wizard';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { safeNextPath } from '@/lib/auth';

export const metadata: Metadata = { title: 'Create account' };

export default async function RegisterPage({
  searchParams,
}: {
  readonly searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return (
    <div className="min-h-screen bg-bg-subtle">
      <SiteHeader />
      <main id="main">
        <OnboardingWizard next={safeNextPath(next)} />
      </main>
      <SiteFooter />
    </div>
  );
}
