import type { Metadata } from 'next';
import { AuthFlow } from '@/components/auth/auth-flow';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { safeNextPath } from '@/lib/auth';

export const metadata: Metadata = { title: 'Sign in' };

export default async function LoginPage({
  searchParams,
}: {
  readonly searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return (
    <div className="min-h-screen bg-bg-subtle">
      <SiteHeader />
      <main id="main">
        <AuthFlow mode="login" next={safeNextPath(next)} />
      </main>
      <SiteFooter />
    </div>
  );
}
