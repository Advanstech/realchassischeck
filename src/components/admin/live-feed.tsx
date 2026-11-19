'use client';

import { motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/cn';

export interface LiveEvent {
  readonly at: string;
  readonly label: string;
  readonly tone?: 'neutral' | 'ok' | 'warn' | 'bad';
}

const DOT: Record<NonNullable<LiveEvent['tone']>, string> = {
  neutral: 'bg-navy-300',
  ok: 'bg-success',
  warn: 'bg-warning',
  bad: 'bg-danger',
};

/**
 * The newest event is lifted onto a tinted row, so staff can see the last thing that
 * happened without reading every line. Real events arrive over SSE in M2.
 */
export function LiveFeed({ events }: { readonly events: ReadonlyArray<LiveEvent> }) {
  const reduce = useReducedMotion();

  return (
    <ol className="mt-4 flex flex-col">
      {events.map((event, index) => (
        <motion.li
          key={`${event.at}-${event.label}`}
          initial={{ opacity: 0, x: index === 0 ? -8 : 0 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: reduce ? 0 : 0.3, delay: reduce ? 0 : index * 0.04 }}
          className={cn(
            'grid grid-cols-[3rem_1fr] items-center gap-3 rounded-md px-2 py-2.5',
            index === 0 ? 'bg-info-bg' : '',
          )}
        >
          <span className="num text-caption text-text-subtle">{event.at}</span>
          <span className="flex items-center gap-2 text-small text-text">
            <span aria-hidden="true" className={cn('size-1.5 shrink-0 rounded-full', DOT[event.tone ?? 'neutral'])} />
            {event.label}
          </span>
        </motion.li>
      ))}
    </ol>
  );
}
