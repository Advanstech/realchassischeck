'use client';

import { Check, Lock } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode, Ref } from 'react';
import { cn } from '@/lib/cn';

export type StationState = 'done' | 'active' | 'todo';

interface StationProps {
  readonly index: number;
  readonly label: string;
  readonly state: StationState;
  readonly stateLabel: string;
  readonly last: boolean;
  readonly slide: number;
  readonly visitLabel: string;
  readonly onVisit: () => void;
  readonly summary?: string;
  readonly hint?: string;
  readonly editLabel: string;
  readonly onEdit: () => void;
  readonly panelRef?: Ref<HTMLDivElement>;
  readonly children?: ReactNode;
}

/**
 * One station on the setup line. On desktop the row reflows: stamped stations
 * narrow to summary cards on the left, the open station holds the working panel,
 * locked stations wait on the right. On mobile the same row becomes a node rail
 * and the open panel spans beneath it.
 */
export function WizardStation({
  index,
  label,
  state,
  stateLabel,
  last,
  slide,
  visitLabel,
  onVisit,
  summary,
  hint,
  editLabel,
  onEdit,
  panelRef,
  children,
}: StationProps) {
  const reduced = useReducedMotion();

  return (
    <li
      className="contents lg:flex lg:min-w-0 lg:flex-col lg:transition-[flex-basis,flex-grow] lg:duration-500 lg:ease-[var(--ease-standard)] lg:motion-reduce:transition-none"
      style={{
        flexGrow: state === 'active' ? 1 : 0,
        flexBasis: state === 'active' ? 460 : state === 'done' ? 232 : 184,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduced ? 0 : 0.32, delay: reduced ? 0 : index * 0.07, ease: [0.2, 0, 0, 1] }}
        style={{ gridColumnStart: index + 1, gridRowStart: 1 }}
        className="relative flex flex-col items-center gap-2 lg:items-start"
      >
        <button
          type="button"
          onClick={onVisit}
          disabled={state === 'todo'}
          aria-current={state === 'active' ? 'step' : undefined}
          aria-label={visitLabel}
          className={cn(
            'relative z-10 grid size-11 shrink-0 place-items-center rounded-full border-2 text-small font-bold transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-brand/20',
            state === 'done' && 'border-brand bg-brand text-on-brand hover:border-cta',
            state === 'active' && 'border-cta bg-header text-on-inverse',
            state === 'todo' && 'border-border-strong bg-bg-subtle text-text-subtle',
          )}
        >
          {state === 'done' ? <Check className="size-5" aria-hidden="true" /> : index + 1}
          {state === 'active' ? (
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 rounded-full border-2 border-cta"
              initial={{ scale: 1, opacity: 0.6 }}
              animate={reduced ? { scale: 1, opacity: 0 } : { scale: [1, 1.4], opacity: [0.6, 0] }}
              transition={reduced ? { duration: 0 } : { duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
            />
          ) : null}
        </button>
        <span
          className={cn(
            'line-clamp-2 max-w-full text-center text-caption font-semibold lg:line-clamp-1 lg:text-left lg:text-small',
            state === 'todo' ? 'text-text-subtle' : 'text-text',
          )}
        >
          {label}
        </span>
        <span className="hidden text-caption text-text-subtle lg:block">{stateLabel}</span>
        <span
          aria-hidden="true"
          className={cn(
            'absolute top-[21px] left-[calc(50%+26px)] -right-6 h-0.5 transition-colors duration-500 motion-reduce:transition-none lg:left-[26px] lg:-right-4',
            last && 'hidden',
            state === 'done' ? 'bg-cta' : 'bg-hairline-strong/60',
          )}
        />
      </motion.div>

      <div
        style={{ gridRowStart: 2, gridColumn: '1 / -1' }}
        className={cn('mt-8 lg:mt-5 lg:min-w-0', state !== 'active' && 'hidden lg:block')}
      >
        {state === 'active' ? (
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            initial={{ opacity: 0, x: slide }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: reduced ? 0 : 0.24, ease: [0.2, 0, 0, 1] }}
            className="panel-raised overflow-hidden p-6 outline-none sm:p-8"
          >
            {children}
          </motion.div>
        ) : state === 'done' ? (
          <div className="panel flex flex-col gap-1.5 p-4">
            <p className="flex items-center gap-1.5 text-caption font-semibold uppercase tracking-wide text-success-ink">
              <Check className="size-3.5" aria-hidden="true" />
              {stateLabel}
            </p>
            <p className="truncate text-small font-semibold text-text" title={summary}>
              {summary}
            </p>
            <button type="button" onClick={onEdit} className="min-h-11 self-start text-caption font-semibold text-link underline">
              {editLabel}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5 rounded-lg border border-dashed border-border-strong p-4">
            <p className="flex items-center gap-1.5 text-caption font-semibold uppercase tracking-wide text-text-subtle">
              <Lock className="size-3.5" aria-hidden="true" />
              {stateLabel}
            </p>
            <p className="text-caption text-text-subtle">{hint}</p>
          </div>
        )}
      </div>
    </li>
  );
}