export function PreviewSkeleton() {
  return (
    <div className="flex flex-col gap-6 pb-24 lg:pb-0" role="status" aria-live="polite">
      <span className="sr-only">Opening your saved preview…</span>
      <div className="grid items-start gap-8 lg:grid-cols-[1.55fr_0.85fr] lg:gap-10">
        <div className="flex flex-col gap-6">
          <div className="h-32 animate-pulse rounded-lg border border-hairline bg-surface" aria-hidden="true" />
          <div className="rounded-lg border border-hairline bg-surface p-5" aria-hidden="true">
            <div className="h-3 w-24 animate-pulse rounded bg-border" />
            <div className="mt-4 h-6 w-3/4 animate-pulse rounded bg-border" />
            <div className="mt-4 h-8 w-2/3 animate-pulse rounded bg-border" />
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="h-10 animate-pulse rounded bg-border" />
              <div className="h-10 animate-pulse rounded bg-border" />
              <div className="h-10 animate-pulse rounded bg-border" />
              <div className="h-10 animate-pulse rounded bg-border" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3" aria-hidden="true">
            {[0, 1, 2, 3].map((key) => (
              <div key={key} className="h-24 animate-pulse rounded-lg border border-hairline bg-surface" />
            ))}
          </div>
          <div className="h-64 animate-pulse rounded-lg border border-hairline bg-surface" aria-hidden="true" />
        </div>
        <div className="hidden h-96 animate-pulse rounded-lg border border-hairline bg-surface lg:block" aria-hidden="true" />
      </div>
    </div>
  );
}
