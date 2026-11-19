import { ExternalLink, LogOut } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';
import { signOut } from '@/app/admin/actions';
import { AdminNav } from '@/components/admin/admin-nav';
import { AdminSearch } from '@/components/admin/admin-search';
import { ThemeMenu, ThemeSwitch } from '@/components/theme/theme-switch';
import { cn } from '@/lib/cn';
import type { StaffAccount } from '@/lib/staff-session';

const STATUS: ReadonlyArray<{ key: 'statusPayments' | 'statusProvider' | 'statusQueue' | 'statusWebhooks'; value?: string; state: 'ok' | 'warn' }> = [
  { key: 'statusPayments', state: 'ok' },
  { key: 'statusProvider', state: 'ok' },
  { key: 'statusQueue', value: '3', state: 'warn' },
  { key: 'statusWebhooks', state: 'ok' },
];

const ROLE_KEY: Record<StaffAccount['role'], 'roleSuperAdmin' | 'roleOperations' | 'roleFinance' | 'roleSupport'> = {
  SUPER_ADMIN: 'roleSuperAdmin',
  OPERATIONS: 'roleOperations',
  FINANCE: 'roleFinance',
  SUPPORT: 'roleSupport',
};

function initials(staff: StaffAccount): string {
  const source = staff.name?.trim() || staff.email;
  const parts = source.split(/[\s@.]+/).filter(Boolean);
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export async function AdminShell({
  children,
  staff,
}: {
  readonly children: ReactNode;
  readonly staff: StaffAccount;
}) {
  const t = await getTranslations('admin');
  const brand = await getTranslations('brand');

  return (
    <div className="min-h-screen bg-bg-subtle lg:grid lg:grid-cols-[248px_minmax(0,1fr)]">
      {/* Rail: the only dark surface in the console, so the content stays calm. */}
      <aside className="rail-canvas hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:p-4 dark:border-r dark:border-white/10">
        <Link href="/admin" className="flex flex-col gap-2 px-1 py-2 text-on-inverse no-underline">
          <Image src="/monogram-rcc.png" alt="" width={727} height={197} style={{ height: 36, width: 'auto' }} className="self-start" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-navy-400">{t('console')}</span>
        </Link>

        <div className="mt-6">
          <AdminNav permissions={staff.permissions} />
        </div>

        <div className="mt-auto flex flex-col gap-3 border-t border-white/10 pt-4">
          <ThemeSwitch tone="inverse" className="self-start" />
          <Link
            href="/"
            className="flex min-h-11 items-center gap-2 rounded-md px-3 text-small font-medium text-navy-200 no-underline transition-colors hover:bg-white/5 hover:text-white"
          >
            <ExternalLink className="size-4" aria-hidden="true" />
            {t('viewSite')}
          </Link>
          <div className="flex items-center gap-3 px-1">
            <span className="num grid size-9 place-items-center rounded-full bg-white/10 text-caption font-bold text-white">
              {initials(staff)}
            </span>
            <span className="min-w-0 text-small leading-tight">
              <span className="block truncate font-semibold text-white">{staff.name ?? staff.email}</span>
              <span className="block text-caption text-navy-300">{t(ROLE_KEY[staff.role])}</span>
            </span>
            <form action={signOut} className="ml-auto">
              <button
                type="submit"
                aria-label={t('signOut')}
                title={t('signOut')}
                className="grid size-11 place-items-center rounded-md text-navy-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                <LogOut className="size-4" aria-hidden="true" />
              </button>
            </form>
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        <div className="sticky top-0 z-10 border-b border-hairline bg-surface/90 backdrop-blur">
          <div className="mx-auto flex w-full max-w-[1720px] flex-wrap items-center gap-4 px-4 py-3 sm:px-6">
            <Link href="/admin" className="flex items-center gap-2 lg:hidden">
              <Image src="/icon-192.png" alt="" width={28} height={28} className="size-7 rounded-md" />
              <span className="text-small font-bold text-brand">{brand('short')}</span>
            </Link>
            <ThemeMenu tone="default" className="ml-auto lg:hidden" />
            <AdminSearch label={t('search')} />
            <ul className="ml-auto hidden items-center gap-4 xl:flex">
              {STATUS.map((status) => (
                <li key={status.key} className="flex items-center gap-1.5 text-caption font-medium text-text-muted">
                  <span
                    aria-hidden="true"
                    className={cn('size-2 rounded-full', status.state === 'ok' ? 'bg-success' : 'bg-warning')}
                  />
                  {t(status.key)}
                  {status.value ? <span className="num font-bold text-text">{status.value}</span> : null}
                </li>
              ))}
            </ul>
          </div>
          <div className="px-3 pb-2 lg:hidden">
            <div className="rail-canvas rounded-lg px-2 py-1">
              <div className="[mask-image:linear-gradient(to_right,#000_88%,transparent)]">
                <AdminNav layout="bar" permissions={staff.permissions} />
              </div>
            </div>
          </div>
        </div>

        <main id="main" className="mx-auto w-full max-w-[1720px] p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
