import { PreviewSkeleton } from '@/components/preview-skeleton';
import { SiteHeader } from '@/components/site-header';

export default function PreviewLoading() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <PreviewSkeleton />
      </main>
    </div>
  );
}
