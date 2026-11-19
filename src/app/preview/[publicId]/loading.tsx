import { PreviewSkeleton } from '@/components/preview-skeleton';
import { SiteHeader } from '@/components/site-header';

export default function PreviewLoading() {
  return (
    <div className="min-h-screen bg-bg-subtle">
      <SiteHeader />
      <main className="mx-auto max-w-[960px] px-4 py-6 sm:py-10">
        <PreviewSkeleton />
      </main>
    </div>
  );
}
