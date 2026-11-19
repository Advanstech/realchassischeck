'use client';

import {
  ArrowLeftRight,
  ChartNoAxesColumn,
  LayoutDashboard,
  PlugZap,
  ReceiptText,
  ShieldCheck,
  SlidersHorizontal,
  UserCog,
  Users,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { can, NAV_PERMISSION, type NavKey, type StaffPermission } from '@/lib/admin/access';
import { cn } from '@/lib/cn';

interface Item {
  readonly href?: string;
  readonly key: NavKey;
  readonly icon: LucideIcon;
  readonly badge?: number;
  readonly soon?: boolean;
}

const ITEMS: ReadonlyArray<Item> = [
  { href: '/admin', key: 'overview', icon: LayoutDashboard },
  { href: '/admin/orders', key: 'orders', icon: ReceiptText, badge: 3 },
  { key: 'transactions', icon: ArrowLeftRight, soon: true },
  { href: '/admin/providers', key: 'providers', icon: PlugZap },
  { key: 'customers', icon: Users, soon: true },
  { key: 'analytics', icon: ChartNoAxesColumn, soon: true },
  { key: 'settings', icon: SlidersHorizontal, soon: true },
  { key: 'audit', icon: ShieldCheck, soon: true },
  { href: '/admin/staff', key: 'staff', icon: UserCog },
];

/**
 * Only routes that exist are links, and only routes the signed-in role may use are
 * shown at all. Everything else is stated plainly and disabled, so staff never hit
 * a dead end that looks like a page.
 */
export function AdminNav({
  layout = 'rail',
  permissions,
}: {
  readonly layout?: 'rail' | 'bar';
  readonly permissions: readonly StaffPermission[];
}) {
  const t = useTranslations('admin.nav');
  const pathname = usePathname();
  const rail = layout === 'rail';
  const items = ITEMS.filter((item) => can(permissions, NAV_PERMISSION[item.key]));

  return (
    <nav
      aria-label={t('overview')}
      className={rail ? 'flex flex-col gap-1' : 'flex flex-row gap-1 overflow-x-auto pb-1'}
    >
      {items.map((item) => {
        const active = item.href
          ? item.href === '/admin'
            ? pathname === '/admin'
            : pathname === item.href || pathname.startsWith(`${item.href}/`)
          : false;
        const Icon = item.icon;
        const content = (
          <>
            <Icon className="size-[18px] shrink-0" aria-hidden="true" />
            <span className="flex-1 whitespace-nowrap">{t(item.key)}</span>
            {item.badge ? (
              <span className="num rounded-full bg-cta px-1.5 py-0.5 text-[11px] font-bold text-on-cta">{item.badge}</span>
            ) : null}
            {item.soon ? <span className="text-[10px] font-semibold uppercase text-navy-400">1B</span> : null}
          </>
        );

        if (!item.href) {
          return (
            <span
              key={item.key}
              aria-disabled="true"
              className="flex min-h-11 cursor-not-allowed items-center gap-3 rounded-md px-3 text-small text-navy-400"
            >
              {content}
            </span>
          );
        }

        return (
          <Link
            key={item.key}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'relative flex min-h-11 items-center gap-3 rounded-md px-3 text-small font-medium no-underline transition-colors duration-150',
              active ? 'bg-white/10 text-white' : 'text-navy-200 hover:bg-white/5 hover:text-white',
            )}
          >
            {active ? (
              <span
                aria-hidden="true"
                className={
                  rail ? 'absolute inset-y-2 left-0 w-[3px] rounded-full bg-cta' : 'absolute inset-x-3 bottom-0 h-[3px] rounded-full bg-cta'
                }
              />
            ) : null}
            {content}
          </Link>
        );
      })}
    </nav>
  );
}
