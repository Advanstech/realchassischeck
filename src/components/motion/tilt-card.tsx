'use client';

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * A card that leans towards the pointer in three dimensions.
 * The effect is pointer-only, never on touch, and disappears with reduced motion,
 * so it is decoration and never a barrier.
 */
export function TiltCard({
  children,
  className,
  intensity = 7,
}: {
  readonly children: ReactNode;
  readonly className?: string;
  readonly intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [finePointer, setFinePointer] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-intensity, intensity]), { stiffness: 140, damping: 18 });
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [intensity, -intensity]), { stiffness: 140, damping: 18 });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const query = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setFinePointer(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  const active = finePointer && !reduce;

  return (
    <div ref={ref} className={cn('[perspective:1400px]', className)}>
      <motion.div
        style={active ? { rotateX, rotateY, transformStyle: 'preserve-3d' } : undefined}
        onPointerMove={(event) => {
          if (!active || !ref.current) return;
          const rect = ref.current.getBoundingClientRect();
          x.set((event.clientX - rect.left) / rect.width - 0.5);
          y.set((event.clientY - rect.top) / rect.height - 0.5);
        }}
        onPointerLeave={() => {
          x.set(0);
          y.set(0);
        }}
        className="h-full w-full [transform-style:preserve-3d]"
      >
        {children}
      </motion.div>
    </div>
  );
}

/** Lift for children inside a `TiltCard`; no effect on its own. */
export function TiltLayer({ children, depth = 40, className }: { readonly children: ReactNode; readonly depth?: number; readonly className?: string }) {
  return (
    <div className={className} style={{ transform: `translateZ(${depth}px)` }}>
      {children}
    </div>
  );
}
