'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { trackEvent } from '@/lib/analytics';
import { ApiRequestError, getPreview, type PreviewPayload } from '@/lib/api';
import { PreviewSkeleton } from './preview-skeleton';
import { PreviewView } from './preview-view';

interface PreviewClientProps {
  readonly publicId: string;
  readonly initialData?: PreviewPayload;
}

export function PreviewClient({ publicId, initialData }: PreviewClientProps) {
  const t = useTranslations('preview');
  const preview = useQuery({
    queryKey: ['preview', publicId],
    queryFn: ({ signal }) => getPreview(publicId, signal),
    initialData,
  });

  useEffect(() => {
    if (preview.data) trackEvent('preview_viewed', { status: preview.data.status });
  }, [preview.data]);

  const expired = preview.error instanceof ApiRequestError && preview.error.body.code === 'SHARE_LINK_EXPIRED';

  return (
    <div className="min-h-screen">
      <main id="main">
        {preview.isPending ? (
          <PreviewSkeleton />
        ) : preview.error ? (
          <div className="mx-auto w-full max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
            <section className="panel mx-auto mt-10 max-w-[34rem] p-6 text-center">
              <h1 className="text-h2 font-extrabold text-brand">{expired ? t('expiredTitle') : t('errorTitle')}</h1>
              <p className="mt-3 text-small text-text-muted">
                {preview.error instanceof ApiRequestError ? preview.error.message : t('errorBody')}
              </p>
              <Button variant="secondary" className="mt-5" onClick={() => void preview.refetch()}>
                {t('retry')}
              </Button>
            </section>
          </div>
        ) : preview.data ? (
          <PreviewView preview={preview.data} />
        ) : null}
      </main>
    </div>
  );
}
