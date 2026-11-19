'use client';

import { motion, useReducedMotion, type Variants } from 'motion/react';
import type { ReactNode } from 'react';

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Entrance for a section. Content is only ever hidden for an instant on the way in;
 * with reduced motion it renders immediately at full opacity.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  distance = 24,
}: {
  readonly children: ReactNode;
  readonly className?: string;
  readonly delay?: number;
  readonly distance?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px -6% 0px' }}
      transition={{ duration: reduce ? 0 : 0.56, delay: reduce ? 0 : delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

const group: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const still: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0, delayChildren: 0 } },
};

/**
 * Initial styles must be identical on the server and the client, so `hidden` is
 * fixed and only the transition shortens to nothing for reduced motion.
 */
const item = (reduce: boolean | null): Variants => ({
  hidden: { opacity: 0, y: 18 },
  shown: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.5, ease: EASE } },
});

/** A list whose children arrive one after another, 70 ms apart. */
export function Stagger({
  children,
  className,
  disabled = false,
}: {
  readonly children: ReactNode;
  readonly className?: string;
  readonly disabled?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={reduce ? still : group}
      initial={disabled ? false : 'hidden'}
      whileInView="shown"
      viewport={{ once: true, margin: '-8% 0px' }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { readonly children: ReactNode; readonly className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={className} variants={item(reduce)}>
      {children}
    </motion.div>
  );
}
