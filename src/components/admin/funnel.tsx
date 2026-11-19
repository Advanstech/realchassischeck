'use client';

import { motion, useReducedMotion } from 'motion/react';

/** Proportional bars with the count at the end; widths animate once on entry. */
export function Funnel({ items }: { readonly items: ReadonlyArray<{ key: string; value: number }> }) {
  const reduce = useReducedMotion();
  const max = Math.max(...items.map((item) => item.value), 1);

  return (
    <ul className="mt-4 flex flex-col gap-3">
      {items.map((item, index) => (
        <li key={item.key} className="grid grid-cols-[5.5rem_1fr_auto] items-center gap-3">
          <span className="truncate text-caption text-text-muted">{item.key}</span>
          <span className="block h-2 overflow-hidden rounded-full bg-bg-subtle">
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : index * 0.06, ease: [0.16, 1, 0.3, 1] }}
              style={{ width: `${Math.max((item.value / max) * 100, 1.5)}%` }}
              className={
                item.key === 'Paid'
                  ? 'block h-full origin-left rounded-full bg-cta'
                  : 'block h-full origin-left rounded-full bg-navy-800 dark:bg-navy-500'
              }
            />
          </span>
          <span className="num w-12 text-right text-caption font-semibold text-text">{item.value.toLocaleString('en-GH')}</span>
        </li>
      ))}
    </ul>
  );
}
