'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Chip } from '@/components/ui/primitives';
import { cn } from '@/lib/cn';
import type { switches } from '@/lib/admin/data';

type Switch = (typeof switches)[number];

/**
 * Switches are audited in production: the actor, the reason and the previous value
 * are written every time one moves. This build has no admin API yet, so a change is
 * held in local state and the panel says so rather than implying a saved setting.
 */
export function SwitchList({
  items,
  canEdit,
}: {
  readonly items: ReadonlyArray<Switch>;
  readonly canEdit: boolean;
}) {
  const t = useTranslations('admin.providers');
  const [state, setState] = useState<ReadonlyArray<boolean>>(() => items.map((item) => item.on));
  const [touched, setTouched] = useState<ReadonlyArray<boolean>>(() => items.map(() => false));

  const anyTouched = touched.some(Boolean);

  return (
    <div className="flex flex-col">
      <ul className="divide-y divide-hairline">
        {items.map((item, index) => {
          const on = state[index] ?? item.on;
          return (
            <li key={item.name} className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0">
              <div className="min-w-0">
                <p className="text-small font-semibold text-text">{item.name}</p>
                <p className="mt-0.5 text-caption leading-relaxed text-text-muted">{item.detail}</p>
                {touched[index] ? (
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-warning-ink">{t('changed')}</p>
                ) : null}
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={on}
                aria-label={item.name}
                disabled={!canEdit}
                onClick={() => {
                  setState((current) => current.map((value, position) => (position === index ? !value : value)));
                  setTouched((current) => current.map((value, position) => position === index || value));
                }}
                className={cn(
                  'relative mt-0.5 h-6 min-h-0 w-11 shrink-0 rounded-full border transition-colors duration-150',
                  'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/15',
                  !canEdit && 'cursor-not-allowed opacity-50',
                  on
                    ? 'border-brand bg-brand dark:border-navy-400 dark:bg-navy-400'
                    : 'border-transparent bg-border dark:bg-navy-800',
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute top-1/2 size-4 -translate-y-1/2 rounded-full bg-white shadow-e1 transition-[left] duration-150 ease-[var(--ease-standard)] dark:bg-navy-950',
                    on ? 'left-[22px]' : 'left-[3px]',
                  )}
                />
              </button>
            </li>
          );
        })}
      </ul>
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-hairline pt-3">
        <p className="text-caption text-text-subtle">{canEdit ? t('switchesNote') : t('readOnlyNote')}</p>
        {anyTouched ? <Chip tone="warning">{t('changed')}</Chip> : null}
      </div>
    </div>
  );
}
