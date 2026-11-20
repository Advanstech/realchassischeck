export function PreviewSkeleton() {
  return (
    <div className="pb-24 lg:pb-0" role="status" aria-live="polite">
      <span className="sr-only">Opening your saved preview…</span>
      <div className="hero-canvas hero-grid">
        <div className="mx-auto w-full max-w-[1400px] px-4 py-14 sm:px-6 sm:py-16 lg:px-8" aria-hidden="true">
          <div className="h-3 w-32 animate-pulse rounded bg-white/15" />
          <div className="mt-6 h-9 w-2/3 max-w-[34rem] animate-pulse rounded bg-white/15" />
          <div className="mt-3 h-4 w-1/2 max-w-[30rem] animate-pulse rounded bg-white/10" />
          <div className="mt-10 h-24 w-full max-w-[30rem] animate-pulse rounded-sheet bg-white/10" />
        </div>
      </div>
      <div className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.85fr)] lg:gap-8">
          <div className="flex flex-col gap-6">
            <div className="panel-raised h-56 animate-pulse bg-bg-subtle" aria-hidden="true" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3" aria-hidden="true">
              {[0, 1, 2, 3].map((key) => (
                <div key={key} className="h-24 animate-pulse rounded-lg border border-hairline bg-surface" />
              ))}
            </div>
            <div className="panel-raised h-64 animate-pulse bg-bg-subtle" aria-hidden="true" />
          </div>
          <div className="panel-raised hidden h-96 animate-pulse bg-bg-subtle lg:block" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
