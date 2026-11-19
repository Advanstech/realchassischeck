import type { Metadata } from 'next';
import { AccountView } from '@/components/auth/account-view';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

export const metadata: Metadata = { title: 'Your account' };

export default function AccountPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main id="main">
        <AccountView />
      </main>
      <SiteFooter />
    </div>
  );
}
