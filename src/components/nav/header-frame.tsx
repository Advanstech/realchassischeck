'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { ScrollProgress } from '@/components/nav/scroll-progress';

/**
 * The sticky frame. A passive scroll listener (no rAF dependency) toggles the
 * scrolled state so the header gains a shadow the moment the page moves.
 */
export function HeaderFrame({ children }: { readonly children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="site-header sticky top-0 z-40 bg-header text-on-inverse" data-scrolled={scrolled}>
      {children}
      <ScrollProgress />
    </header>
  );
}