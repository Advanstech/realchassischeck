'use client';

import { isThemeMode, THEME_STORAGE_KEY, type ThemeMode } from '@/lib/theme';

/**
 * Appearance is an external store rather than component state: localStorage and
 * the OS media query both live outside React, and useSyncExternalStore lets the
 * components subscribe without a setState-in-effect cascade.
 */

const listeners = new Set<() => void>();

function readMode(): ThemeMode {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isThemeMode(stored) ? stored : 'system';
  } catch {
    return 'system';
  }
}

export function getStoredMode(): ThemeMode {
  return readMode();
}

export function getServerMode(): ThemeMode {
  return 'system';
}

export function subscribeToMode(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY) listener();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

export function storeMode(mode: ThemeMode): void {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    // Private mode or a full quota: the in-memory choice still applies this session.
  }
  for (const listener of listeners) listener();
}

function darkQuery(): MediaQueryList | null {
  return typeof window === 'undefined' ? null : window.matchMedia('(prefers-color-scheme: dark)');
}

export function getPrefersDark(): boolean {
  return darkQuery()?.matches ?? false;
}

export function getServerPrefersDark(): boolean {
  return false;
}

export function subscribeToPrefersDark(listener: () => void): () => void {
  const media = darkQuery();
  if (!media) return () => {};
  media.addEventListener('change', listener);
  return () => media.removeEventListener('change', listener);
}
