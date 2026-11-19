'use client';

import { motion, useReducedMotion } from 'motion/react';

/**
 * Fourteen bars, one per day. Bars grow from the baseline once, and the final bar
 * (today) carries the red accent so the eye lands on the present day first.
 */
export function SalesChart({ series }: { readonly series: ReadonlyArray<{ day: string; value: number }> }) {
  const reduce = useReducedMotion();
  const max = Math.max(...series.map((point) => point.value), 1);

  return (
    <div>
      <div className="relative mt-2">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 flex h-48 flex-col justify-between">
          {[0, 1, 2, 3].map((line) => (
            <span key={line} className="block border-t border-dashed border-hairline" />
          ))}
        </div>
        <ul className="relative flex h-48 items-end gap-1.5 sm:gap-2">
          {series.map((point, index) => {
            const today = index === series.length - 1;
            return (
              <li key={point.day} className="group flex h-full flex-1 flex-col justify-end">
                <span className="sr-only">
                  {point.day} Nov: {point.value} paid reports
                </span>
                <motion.span
                  aria-hidden="true"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : index * 0.03, ease: [0.16, 1, 0.3, 1] }}
                  style={{ height: `${Math.max((point.value / max) * 100, 4)}%` }}
                  className={
                    today
                      ? 'block w-full origin-bottom rounded-t-xs bg-cta transition-colors'
                      : 'block w-full origin-bottom rounded-t-xs bg-navy-800 transition-colors group-hover:bg-navy-600 dark:bg-navy-500 dark:group-hover:bg-navy-400'
                  }
                />
              </li>
            );
          })}
        </ul>
      </div>
      <ul aria-hidden="true" className="mt-2 flex gap-1.5 sm:gap-2">
        {series.map((point, index) => (
          <li
            key={point.day}
            className={
              index === series.length - 1
                ? 'num flex-1 text-center text-[11px] font-bold text-cta'
                : 'num flex-1 text-center text-[11px] text-text-subtle'
            }
          >
            {point.day}
          </li>
        ))}
      </ul>
    </div>
  );
}
