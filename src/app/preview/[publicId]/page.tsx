import type { Metadata } from 'next';
import { PreviewClient } from '@/components/preview-client';
import { getServerPreview } from '@/lib/server-preview';

export const metadata: Metadata = {
  title: 'Free vehicle preview',
  robots: { index: false, follow: false },
};

export default async function PreviewPage({ params }: { readonly params: Promise<{ publicId: string }> }) {
  const { publicId } = await params;
  const initialData = await getServerPreview(publicId);
  return <PreviewClient publicId={publicId} initialData={initialData} />;
}
