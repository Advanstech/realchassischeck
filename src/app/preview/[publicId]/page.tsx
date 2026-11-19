import type { Metadata } from 'next';
import { PreviewClient } from '@/components/preview-client';
import { SiteHeader } from '@/components/site-header';
import { getServerPreview } from '@/lib/server-preview';

export const metadata: Metadata = {
  title: 'Free vehicle preview',
  robots: { index: false, follow: false },
};

export default async function PreviewPage({ params }: { readonly params: Promise<{ publicId: string }> }) {
  const { publicId } = await params;
  const initialData = await getServerPreview(publicId);
  return (
    <>
      {/* The header is a server component; keeping it out of the client island matters. */}
      <SiteHeader />
      <PreviewClient publicId={publicId} initialData={initialData} />
    </>
  );
}
