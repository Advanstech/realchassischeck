import { AlertTriangle, CheckCircle2, HelpCircle, XCircle, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type VerdictState = 'clear' | 'caution' | 'high_risk' | 'unknown';

/* Colour never carries the meaning alone: every state has its own icon and word. */
const STATES: Record<VerdictState, { label: string; icon: LucideIcon; box: string; ink: string }> = {
  clear: {
    label: 'Clear',
    icon: CheckCircle2,
    box: 'border-success/45 bg-success-bg',
    ink: 'text-success-ink',
  },
  caution: {
    label: 'Caution',
    icon: AlertTriangle,
    box: 'border-warning/45 bg-warning-bg',
    ink: 'text-warning-ink',
  },
  high_risk: {
    label: 'High risk',
    icon: XCircle,
    box: 'border-danger/45 bg-danger-bg',
    ink: 'text-danger-ink',
  },
  unknown: {
    label: 'Unknown',
    icon: HelpCircle,
    box: 'border-info/40 bg-info-bg',
    ink: 'text-info-ink',
  },
};

export function VerdictCard({
  state,
  title,
  message,
  reasons,
  className,
  compact = false,
}: {
  readonly state: VerdictState;
  readonly title: string;
  readonly message?: string;
  readonly reasons?: ReadonlyArray<string>;
  readonly className?: string;
  readonly compact?: boolean;
}) {
  const { label, icon: Icon, box, ink } = STATES[state];
  return (
    <section
      aria-label={`Verdict: ${label}`}
      className={cn('rounded-lg border-[1.5px]', box, compact ? 'p-4' : 'p-5 sm:p-6', className)}
    >
      <div className="flex items-start gap-3">
        <Icon className={cn('shrink-0', ink, compact ? 'size-6' : 'size-8')} aria-hidden="true" />
        <div className="min-w-0">
          <p className={cn('text-eyebrow font-bold uppercase', ink)}>{label}</p>
          <h3 className={cn('mt-1 font-extrabold text-balance text-brand', compact ? 'text-h3' : 'text-h2')}>{title}</h3>
          {message ? <p className={cn('mt-1.5 text-small', ink)}>{message}</p> : null}
        </div>
      </div>
      {reasons && reasons.length > 0 ? (
        <ul className="mt-4 flex flex-col gap-2 border-t border-current/10 pt-4">
          {reasons.map((reason) => (
            <li key={reason} className={cn('flex gap-2 text-small font-medium', ink)}>
              <span aria-hidden="true" className="mt-1 size-1.5 shrink-0 rounded-full bg-current" />
              {reason}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

/** A labelled divider used inside dense report and admin panels. */
export function FieldRow({
  label,
  children,
  className,
}: {
  readonly label: string;
  readonly children: ReactNode;
  readonly className?: string;
}) {
  return (
    <div className={cn('flex items-baseline justify-between gap-4 py-2', className)}>
      <dt className="text-small text-text-muted">{label}</dt>
      <dd className="num text-small font-semibold text-text">{children}</dd>
    </div>
  );
}
