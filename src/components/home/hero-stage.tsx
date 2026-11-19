'use client';

import { motion, useMotionValue, useScroll, useTransform, type MotionValue } from 'motion/react';
import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react';
import { HOLD_LIMIT, HOLD_MINIMUM, holdOffset } from '@/lib/hero-hold';

const LagContext = createContext<MotionValue<number> | null>(null);

/**
 * Layout position of an element in the page, ignoring transforms. The sample
 * card is translated while it holds, so a rect measurement would feed the
 * offset back into itself; offsetTop stays true.
 */
function pageTop(element: HTMLElement) {
  let top = 0;
  let node: HTMLElement | null = element;
  while (node) {
    top += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return top;
}

/**
 * Hero stage. The page scrolls immediately; the right-hand sample card holds
 * its line for a short travel and is then released. Below lg and for reduced
 * motion the card is plain flow.
 */
export function HeroStage({ children }: { readonly children: ReactNode }) {
  const stage = useRef<HTMLDivElement>(null);
  const pin = useMotionValue(0);
  const { scrollY } = useScroll();
  const lag = useTransform<number, number>([scrollY, pin], (latest) => holdOffset(latest[0] ?? 0, latest[1] ?? 0));

  useEffect(() => {
    const root = stage.current;
    const panel = root?.querySelector<HTMLElement>('[data-hero-panel]');
    const sample = root?.querySelector<HTMLElement>('[data-hero-sample]');
    if (!root || !panel || !sample) return;

    const wide = window.matchMedia('(min-width: 1024px)');
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
    const section = root.parentElement;
    let live = true;

    const measure = () => {
      if (!live) return;
      const span = wide.matches && !calm.matches ? pageTop(panel) - pageTop(sample) : 0;
      const room = section
        ? pageTop(section) + section.offsetHeight - pageTop(sample) - sample.offsetHeight - 12
        : HOLD_LIMIT;
      const limit = Math.min(HOLD_LIMIT, room);
      pin.set(span >= HOLD_MINIMUM && limit >= HOLD_MINIMUM ? Math.min(span, limit) : 0);
    };

    measure();
    wide.addEventListener('change', measure);
    calm.addEventListener('change', measure);
    const observer = new ResizeObserver(measure);
    observer.observe(panel);
    observer.observe(sample);
    void document.fonts.ready.then(measure);

    return () => {
      live = false;
      wide.removeEventListener('change', measure);
      calm.removeEventListener('change', measure);
      observer.disconnect();
    };
  }, [pin]);

  return (
    <LagContext.Provider value={lag}>
      <div ref={stage} className="relative">
        <Aperture />
        {children}
      </div>
    </LagContext.Provider>
  );
}

export function HeroSample({ children, className }: { readonly children: ReactNode; readonly className?: string }) {
  const lag = useContext(LagContext);
  return (
    <motion.div data-hero-sample className={className} style={lag ? { y: lag } : undefined}>
      {children}
    </motion.div>
  );
}

/** Ambient light behind the sample card; drifts open a touch as the page moves. */
function Aperture() {
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 640], [1, 1.08]);
  return (
    <motion.div
      aria-hidden="true"
      className="aperture pointer-events-none absolute -top-40 right-[-10%] z-0 hidden size-[36rem] rounded-full lg:block"
      style={{ scale }}
    />
  );
}
