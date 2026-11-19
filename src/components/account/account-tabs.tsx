'use client';

import { CarFront, Coins, FileText } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Suspense, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { ComingSoonPanel } from './coming-soon-panel';
import { ReportsPanel } from './reports-panel';

export type AccountTab = 'reports' | 'garage' | 'credits';

const TABS: ReadonlyArray<{ value: AccountTab; icon: typeof FileText }> = [
  { value: 'reports', icon: FileText },
  { value: 'garage', icon: CarFront },
  { value: 'credits', icon: Coins },
];

/** Tab strip from the design mockup (m_account.png); the tab lives in the URL. */
function TabsSection() {
  const t = useTranslations('account');
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const reduced = useReducedMotion();

  const raw = searchParams.get('tab');
  const active: AccountTab = raw === 'garage' || raw === 'credits' ? raw : 'reports';

  /* The strip pins under the 64px site header; the sentinel reports when it is stuck. */
  const sentinel = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);
  useEffect(() => {
    const target = sentinel.current;
    if (!target) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) setStuck(!entry.isIntersecting);
      },
      { rootMargin: '-65px 0px 0px 0px', threshold: 0 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <div>
      <div ref={sentinel} aria-hidden="true" className="h-0" />
      <div
        data-stuck={stuck}
        className={cn(
          'sticky top-16 z-30 -mx-4 mt-6 border-b px-4 py-3 transition-[background-color,border-color,box-shadow] duration-200 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8',
          stuck ? 'border-hairline bg-bg/85 shadow-e2 backdrop-blur-md' : 'border-transparent',
        )}
      >
        <div
          role="group"
          aria-label={t('tabs.label')}
          className="inline-flex w-full items-center gap-1 rounded-full border border-hairline bg-bg-subtle p-1 sm:w-auto"
        >
          {TABS.map(({ value, icon: Icon }) => {
            const isActive = value === active;
            return (
              <Link
                key={value}
                href={value === 'reports' ? pathname : `${pathname}?tab=${value}`}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'relative flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full px-4 text-small font-semibold no-underline transition-colors duration-150 sm:flex-none',
                  isActive ? 'text-on-brand' : 'text-text-muted hover:text-brand',
                )}
              >
                {isActive ? (
                  <motion.span
                    layoutId="account-tab-active"
                    className="absolute inset-0 rounded-full bg-brand"
                    transition={{ duration: reduced ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
                    aria-hidden="true"
                  />
                ) : null}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon className="size-4 shrink-0" aria-hidden="true" />
                  {t(`tabs.${value}`)}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: reduced ? 0 : 0.2, ease: 'easeOut' }}
        >
          {active === 'reports' ? <ReportsPanel /> : <ComingSoonPanel kind={active} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function AccountTabs() {
  return (
    <Suspense
      fallback={
        <div className="mt-8 h-12 animate-pulse rounded-full bg-bg-subtle" aria-hidden="true" />
      }
    >
      <TabsSection />
    </Suspense>
  );
}
