'use client';

import { useQuery } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';
import { ApiRequestError, getPreview, type PreviewPayload } from '@/lib/api';
import { PreviewView } from './preview-view';
import { SiteHeader } from './site-header';

interface PreviewClientProps {
  readonly publicId: string;
  readonly initialData?: PreviewPayload;
}

export function PreviewClient({ publicId, initialData }: PreviewClientProps) {
  const preview = useQuery({
    queryKey: ['preview', publicId],
    queryFn: ({ signal }) => getPreview(publicId, signal),
    initialData,
  });

  useEffect(() => {
    if (preview.data) trackEvent('preview_viewed', { status: preview.data.status });
  }, [preview.data]);

  return (
    <div className="min-h-screen bg-bg-subtle">
      <SiteHeader />
      <main className="mx-auto max-w-[960px] px-4 py-6 sm:py-10">
        {preview.isPending ? (
          <div className="flex min-h-72 flex-col items-center justify-center gap-3 text-text-muted" role="status">
            <LoaderCircle className="size-8 animate-spin" aria-hidden="true" />
            <p>Opening your saved preview…</p>
          </div>
        ) : preview.error ? (
          <section className="rounded-lg border border-border bg-surface p-6 text-center">
            <h1 className="text-h2 font-semibold text-brand">
              {preview.error instanceof ApiRequestError && preview.error.body.code === 'SHARE_LINK_EXPIRED'
                ? 'This preview link has expired'
                : 'We could not open this preview'}
            </h1>
            <p className="mt-3 text-text-muted">
              {preview.error instanceof ApiRequestError
                ? preview.error.message
                : 'Check your connection and try again.'}
            </p>
            <button type="button" className="mt-5 min-h-12 rounded-md bg-brand px-5 font-semibold text-on-brand" onClick={() => void preview.refetch()}>
              Try again
            </button>
          </section>
        ) : preview.data ? (
          <PreviewView preview={preview.data} />
        ) : null}
      </main>
    </div>
  );
}
