'use client';

import { RefreshCw, WifiOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

export function PwaLifecycle() {
  const t = useTranslations('pwa');
  const [online, setOnline] = useState(true);
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null);
  const [applying, setApplying] = useState(false);
  const refreshing = useRef(false);

  useEffect(() => {
    const sync = () => setOnline(navigator.onLine);
    sync();
    window.addEventListener('online', sync);
    window.addEventListener('offline', sync);
    return () => {
      window.removeEventListener('online', sync);
      window.removeEventListener('offline', sync);
    };
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return;

    let live = true;
    const onControllerChange = () => {
      if (refreshing.current) window.location.reload();
    };
    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);

    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((registration) => {
        if (!live) return;
        if (registration.waiting) setWaiting(registration.waiting);

        registration.addEventListener('updatefound', () => {
          const worker = registration.installing;
          worker?.addEventListener('statechange', () => {
            if (live && worker.state === 'installed' && navigator.serviceWorker.controller) {
              setWaiting(registration.waiting ?? worker);
            }
          });
        });
      })
      .catch((error: unknown) => {
        console.warn('[pwa] offline support could not start', error);
      });

    return () => {
      live = false;
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
    };
  }, []);

  const applyUpdate = () => {
    if (!waiting) return;
    refreshing.current = true;
    setApplying(true);
    waiting.postMessage({ type: 'SKIP_WAITING' });
  };

  if (waiting) {
    return (
      <div className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-[30rem] flex-col gap-3 rounded-xl border border-hairline bg-surface p-4 text-text shadow-e3 sm:flex-row sm:items-center">
        <RefreshCw className="size-5 shrink-0 text-brand" aria-hidden="true" />
        <div className="min-w-0 flex-1" role="status" aria-live="polite">
          <p className="text-small font-semibold">{t('updateTitle')}</p>
          <p className="mt-0.5 text-caption text-text-muted">{t('updateBody')}</p>
        </div>
        <Button size="sm" variant="secondary" loading={applying} onClick={applyUpdate}>
          {t('refresh')}
        </Button>
      </div>
    );
  }

  if (!online) {
    return (
      <div
        role="status"
        className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-[30rem] items-center gap-3 rounded-xl border border-hairline bg-surface px-4 py-3 text-text shadow-e3"
      >
        <WifiOff className="size-5 shrink-0 text-warning" aria-hidden="true" />
        <p className="text-small">{t('offline')}</p>
      </div>
    );
  }

  return null;
}
