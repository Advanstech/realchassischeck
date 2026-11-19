'use client';

import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

/** One search box for any report ID, phone, email or VIN. Press / to focus it. */
export function AdminSearch({ label }: { readonly label: string }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState('');

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typing = target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
      if (event.key === '/' && !typing) {
        event.preventDefault();
        input.current?.focus();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        const query = value.trim();
        router.push(query ? `/admin/orders?q=${encodeURIComponent(query)}` : '/admin/orders');
      }}
      className="relative w-full max-w-md"
    >
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-subtle" aria-hidden="true" />
      <input
        ref={input}
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        aria-label={label}
        placeholder={label}
        className="h-11 w-full rounded-md border border-hairline bg-bg-subtle pl-9 pr-12 text-small text-text placeholder:text-text-subtle focus:border-brand/40 focus:bg-surface focus:outline-none focus:ring-4 focus:ring-brand/10"
      />
      <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-xs border border-hairline bg-surface px-1.5 py-0.5 text-[11px] font-semibold text-text-subtle">
        /
      </kbd>
    </form>
  );
}
