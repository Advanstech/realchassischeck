'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { NavLink } from '@/components/nav/mobile-nav';
import { cn } from '@/lib/cn';

/** Desktop section links with a scrollspy: the section under the header is marked. */
export function PrimaryNav({ links }: { readonly links: ReadonlyArray<NavLink> }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const ids = links.map((link) => link.href.split('#')[1]).filter((id): id is string => Boolean(id));
    const onScroll = () => {
      let current: string | null = null;
      for (const id of ids) {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= 96) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [links]);

  return (
    <nav aria-label="Primary" className="hidden items-center justify-self-center gap-1 md:flex">
      {links.map((link) => {
        const isActive = active !== null && link.href.endsWith(`#${active}`);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? 'true' : undefined}
            className={cn(
              'relative flex min-h-11 items-center rounded-sm px-3 text-small font-medium no-underline transition-colors duration-150',
              isActive ? 'text-white' : 'text-navy-100 hover:text-white',
            )}
          >
            {link.label}
            <span
              aria-hidden="true"
              className={cn(
                'absolute inset-x-3 bottom-1 h-0.5 rounded-full bg-cta transition-opacity duration-150',
                isActive ? 'opacity-100' : 'opacity-0',
              )}
            />
          </Link>
        );
      })}
    </nav>
  );
}