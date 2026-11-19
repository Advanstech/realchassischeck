import { AlertTriangle, Info, ShieldAlert, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/* ------------------------------------------------------------------ */
/* Section framing                                                     */
/* ------------------------------------------------------------------ */

export function Eyebrow({
  children,
  tone = 'light',
  className,
}: {
  readonly children: ReactNode;
  readonly tone?: 'light' | 'inverse';
  readonly className?: string;
}) {
  return (
    <p
      className={cn(
        'flex items-center gap-2 text-eyebrow font-semibold uppercase',
        tone === 'inverse' ? 'text-navy-200' : 'text-link',
        className,
      )}
    >
      <span aria-hidden="true" className="inline-block size-1.5 rounded-full bg-cta" />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lede,
  tone = 'light',
  className,
  as: As = 'h2',
}: {
  readonly eyebrow?: string;
  readonly title: string;
  readonly lede?: string;
  readonly tone?: 'light' | 'inverse';
  readonly className?: string;
  readonly as?: 'h1' | 'h2';
}) {
  return (
    <div className={cn('max-w-[46rem]', className)}>
      {eyebrow ? <Eyebrow tone={tone}>{eyebrow}</Eyebrow> : null}
      <As
        className={cn(
          'mt-4 text-display-lg font-extrabold text-balance',
          tone === 'inverse' ? 'text-on-inverse' : 'text-brand',
        )}
      >
        {title}
      </As>
      {lede ? (
        <p className={cn('mt-4 max-w-[62ch] text-body', tone === 'inverse' ? 'text-on-inverse-muted' : 'text-text-muted')}>
          {lede}
        </p>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Chips, labels and stat text                                         */
/* ------------------------------------------------------------------ */

export type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'inverse';

const CHIP_TONES: Record<Tone, string> = {
  neutral: 'border-border bg-bg-subtle text-text-muted',
  success: 'border-success/25 bg-success-bg text-success-ink',
  warning: 'border-warning/25 bg-warning-bg text-warning-ink',
  danger: 'border-danger/25 bg-danger-bg text-danger-ink',
  info: 'border-info/25 bg-info-bg text-info-ink',
  inverse: 'border-white/15 bg-white/5 text-navy-100',
};

export function Chip({
  children,
  tone = 'neutral',
  className,
}: {
  readonly children: ReactNode;
  readonly tone?: Tone;
  readonly className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-caption font-semibold',
        CHIP_TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function StatValue({ children, className }: { readonly children: ReactNode; readonly className?: string }) {
  return <p className={cn('num text-display-lg font-extrabold text-brand', className)}>{children}</p>;
}

/* ------------------------------------------------------------------ */
/* Banners: never the only place an error is shown                     */
/* ------------------------------------------------------------------ */

const BANNER_TONES: Record<'info' | 'warning' | 'danger', { box: string; icon: LucideIcon }> = {
  info: { box: 'border-info/30 bg-info-bg text-info-ink', icon: Info },
  warning: { box: 'border-warning/30 bg-warning-bg text-warning-ink', icon: AlertTriangle },
  danger: { box: 'border-danger/30 bg-danger-bg text-danger-ink', icon: ShieldAlert },
};

export function Banner({
  tone = 'info',
  title,
  children,
  className,
}: {
  readonly tone?: 'info' | 'warning' | 'danger';
  readonly title: string;
  readonly children?: ReactNode;
  readonly className?: string;
}) {
  const { box, icon: Icon } = BANNER_TONES[tone];
  return (
    <div role={tone === 'info' ? 'status' : 'alert'} className={cn('flex gap-3 rounded-md border p-4', box, className)}>
      <Icon className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
      <div>
        <p className="font-semibold">{title}</p>
        {children ? <div className="mt-1 text-small">{children}</div> : null}
      </div>
    </div>
  );
}
