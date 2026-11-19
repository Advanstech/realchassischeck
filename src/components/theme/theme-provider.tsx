'use client';

import { createContext, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from 'react';
import { resolveTheme, type ResolvedTheme, type ThemeMode } from '@/lib/theme';
import {
  getPrefersDark,
  getServerMode,
  getServerPrefersDark,
  getStoredMode,
  storeMode,
  subscribeToMode,
  subscribeToPrefersDark,
} from '@/lib/theme-store';

interface ThemeContextValue {
  readonly mode: ThemeMode;
  readonly resolved: ResolvedTheme;
  readonly setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'system',
  resolved: 'light',
  setMode: () => {},
});

/**
 * Owns `data-theme` on <html>. "System" is resolved in JS rather than a media
 * query so the token file needs one dark block only, and the OS change is live.
 */
export function ThemeProvider({ children }: { readonly children: ReactNode }) {
  const mode = useSyncExternalStore(subscribeToMode, getStoredMode, getServerMode);
  const prefersDark = useSyncExternalStore(subscribeToPrefersDark, getPrefersDark, getServerPrefersDark);
  const resolved = resolveTheme(mode, prefersDark);

  // The one imperative bit: the tokens read this attribute.
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = resolved;
    root.style.colorScheme = resolved;
  }, [resolved]);

  const value = useMemo(() => ({ mode, resolved, setMode: storeMode }), [mode, resolved]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
