'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/cn';

export interface FaqItem {
  readonly q: string;
  readonly a: string;
}

/** One panel open at a time; the first answer is open so the section never looks inert. */
export function FaqAccordion({ items }: { readonly items: ReadonlyArray<FaqItem> }) {
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useReducedMotion();

  return (
    <ul className="divide-y divide-hairline border-y border-hairline">
      {items.map((item, index) => {
        const isOpen = open === index;
        const panelId = `faq-panel-${index}`;
        return (
          <li key={item.q}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : index)}
                className="flex min-h-14 w-full items-center justify-between gap-6 py-4 text-left text-body font-semibold text-brand"
              >
                {item.q}
                <span
                  aria-hidden="true"
                  className={cn(
                    'grid size-8 shrink-0 place-items-center rounded-full border border-border-strong text-text-muted transition-transform duration-200',
                    isOpen && 'rotate-45 border-cta text-cta',
                  )}
                >
                  <Plus className="size-4" />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  id={panelId}
                  key="panel"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={reduce ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: reduce ? 0 : 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-[68ch] pb-5 text-small text-text-muted">{item.a}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
