import type { ReactNode } from 'react';

/** CSS-only so the page stays readable when a cached route loads without JavaScript. */
export default function Template({ children }: { readonly children: ReactNode }) {
  return <div className="route-enter">{children}</div>;
}
