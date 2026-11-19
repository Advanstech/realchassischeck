import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { cn } from '@/lib/cn';

/** A 48 × 20 sparkline: enough shape to read a trend, nothing to decode precisely. */
function Sparkline({ points, negative = false }: { readonly points: ReadonlyArray<number>; readonly negative?: boolean }) {
  const max = Math.max(...points, 1);
  const step = 48 / Math.max(points.length - 1, 1);
  const path = points
    .map((value, index) => `${index === 0 ? 'M' : 'L'}${(index * step).toFixed(1)} ${(20 - (value / max) * 17).toFixed(1)}`)
    .join(' ');
  return (
    <svg viewBox="0 0 48 22" className={cn('h-6 w-12', negative ? 'text-text-subtle' : 'text-brand')} aria-hidden="true">
      <path d={path} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
    </svg>
  );
}

export function KpiTile({
  label,
  value,
  delta,
  trend = 'up',
  spark,
}: {
  readonly label: string;
  readonly value: string;
  readonly delta: string;
  readonly trend?: 'up' | 'down' | 'warn';
  readonly spark: ReadonlyArray<number>;
}) {
  const Icon = trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : Minus;
  const tone =
    trend === 'up' ? 'text-success-ink' : trend === 'down' ? 'text-text-muted' : 'text-warning-ink';

  return (
    <article className="panel p-4 sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-caption font-medium text-text-muted sm:text-small">{label}</p>
        <Sparkline points={spark} negative={trend === 'down'} />
      </div>
      <p className="num mt-2 text-h3 font-extrabold leading-none text-brand sm:mt-3 sm:text-h2">{value}</p>
      <p className={cn('mt-2 flex items-center gap-1 text-[11px] font-semibold sm:text-caption', tone)}>
        <Icon className="size-3.5 shrink-0" aria-hidden="true" />
        {delta}
      </p>
    </article>
  );
}
