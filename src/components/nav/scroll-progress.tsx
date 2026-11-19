'use client';

import { motion, useScroll, useSpring } from 'motion/react';

/** A 2 px red rule under the header: the only always-on scroll cue. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 40, restDelta: 0.001 });
  return <motion.div aria-hidden="true" className="h-[2px] origin-left bg-cta" style={{ scaleX }} />;
}
