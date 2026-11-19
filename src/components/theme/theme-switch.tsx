'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { useTheme } from './theme-provider';
import type { ThemeMode } from '@/lib/theme';

const OPTIONS = [
  { value: 'system', icon: Monitor },
  { value: 'light', icon: Sun },
  { value: 'dark', icon: Moon },
] as const satisfies ReadonlyArray<{ value: ThemeMode; icon: typeof Sun }>;

type Tone = 'default' | 'inverse';

/** Three-way segmented control: System / Light / Dark. */
export function ThemeSwitch({
  tone = 'default',
  showLabels = false,
  className,
}: {
  readonly tone?: Tone;
  readonly showLabels?: boolean;
  readonly className?: string;
}) {
  const t = useTranslations('theme');
  const { mode, setMode } = useTheme();

  return (
    <div
      role="group"
      aria-label={t('label')}
      className={cn(
        'inline-flex items-center gap-1 rounded-lg border p-1',
        tone === 'inverse' ? 'border-white/15 bg-white/5' : 'border-hairline bg-bg-subtle',
        className,
      )}
    >
      {OPTIONS.map(({ value, icon: Icon }) => {
        const active = mode === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setMode(value)}
            aria-pressed={active}
            title={t(value)}
            className={cn(
              'flex min-h-11 items-center justify-center gap-1.5 rounded-md text-caption font-semibold transition-colors duration-150',
              showLabels ? 'px-2.5' : 'w-11',
              tone === 'inverse'
                ? active
                  ? 'bg-white/15 text-white'
                  : 'text-navy-200 hover:bg-white/10 hover:text-white'
                : active
                  ? 'bg-surface text-brand shadow-e1 dark:bg-surface-raised dark:shadow-none dark:ring-1 dark:ring-hairline-strong'
                  : 'text-text-muted hover:text-brand',
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden="true" />
            <span className={showLabels ? undefined : 'sr-only'}>{t(value)}</span>
          </button>
        );
      })}
    </div>
  );
}

/** Compact trigger plus panel, for headers where the rail is not on screen. */
export function ThemeMenu({ tone = 'inverse', className }: { readonly tone?: Tone; readonly className?: string }) {
  const t = useTranslations('theme');
  const { resolved } = useTheme();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const Icon = resolved === 'dark' ? Moon : Sun;

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={t('label')}
        className={cn(
          'grid size-11 place-items-center rounded-md border transition-colors duration-150',
          tone === 'inverse'
            ? 'border-white/15 text-on-inverse hover:bg-white/10'
            : 'border-hairline text-text-muted hover:text-brand',
        )}
      >
        <Icon className="size-[18px]" aria-hidden="true" />
      </button>

      {open ? (
        <div
          role="dialog"
          aria-label={t('label')}
          className="absolute right-0 top-[calc(100%+0.5rem)] z-30 w-64 rounded-xl border border-hairline bg-surface p-3 shadow-e3"
        >
          <p className="text-caption font-semibold uppercase tracking-[0.1em] text-text-subtle">{t('label')}</p>
          <ThemeSwitch showLabels className="mt-2 flex w-full [&>button]:flex-1" />
          <p className="mt-2 text-caption text-text-subtle">{t('hint')}</p>
        </div>
      ) : null}
    </div>
  );
}
