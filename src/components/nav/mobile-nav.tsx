'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState, type ReactNode } from 'react';
import { buttonClass } from '@/components/ui/button';

export interface NavLink {
  readonly href: string;
  readonly label: string;
}

/** Mobile menu as a bottom sheet, so the top bar keeps its 44 px targets. */
export function MobileNav({
  links,
  cta,
  closeLabel,
  auth,
}: {
  readonly links: ReadonlyArray<NavLink>;
  readonly cta: string;
  readonly closeLabel: string;
  readonly auth?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        aria-label={cta}
        className="grid size-11 place-items-center rounded-md border border-white/15 text-on-inverse md:hidden"
      >
        <Menu className="size-5" aria-hidden="true" />
      </Dialog.Trigger>
      <AnimatePresence>
        {open ? (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-40 bg-navy-950/60 backdrop-blur-sm"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={reduce ? undefined : { y: '100%' }}
                transition={{ duration: reduce ? 0 : 0.32, ease: [0.16, 1, 0.3, 1] }}
                className="fixed inset-x-0 bottom-0 z-50 rounded-t-[28px] border-t border-white/10 bg-surface p-5 pb-8 shadow-e4"
              >
                <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border-strong" aria-hidden="true" />
                <div className="flex items-center justify-between">
                  <Dialog.Title className="text-h3 font-bold text-brand">Real Chassis Check</Dialog.Title>
                  <Dialog.Close aria-label={closeLabel} className="grid size-11 place-items-center rounded-md text-text-muted">
                    <X className="size-5" aria-hidden="true" />
                  </Dialog.Close>
                </div>
                <nav className="mt-4 flex flex-col">
                  {links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="flex min-h-14 items-center border-b border-hairline font-semibold text-brand no-underline"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                {auth ? (
                  <div className="mt-2 border-t border-hairline pt-2" onClick={() => setOpen(false)}>
                    {auth}
                  </div>
                ) : null}
                <Link href="/#check" onClick={() => setOpen(false)} className={buttonClass('primary', 'md', 'mt-5 w-full')}>
                  {cta}
                </Link>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  );
}
