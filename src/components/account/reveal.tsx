'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

/** One scroll-reveal for account sections: rises and fades in once, near the viewport edge. */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  readonly children: ReactNode;
  readonly className?: string;
  readonly delay?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -64px 0px' }}
      transition={{ duration: reduced ? 0 : 0.4, delay: reduced ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
