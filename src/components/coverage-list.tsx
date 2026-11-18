import { AlertCircle, CheckCircle2, MinusCircle } from 'lucide-react';
import type { PreviewPayload } from '@/lib/api';

export function CoverageList({ sources }: { readonly sources: PreviewPayload['coverage'] }) {
  return (
    <section aria-labelledby="coverage-title" className="rounded-lg border border-border bg-surface p-5">
      <h2 id="coverage-title" className="text-h3 font-semibold text-brand">
        Sources checked and not checked
      </h2>
      <p className="mt-1 text-small text-text-muted">
        A source marked “not covered” was not searched. We do not imply a clear history for those countries.
      </p>
      <ul className="mt-4 divide-y divide-border">
        {sources.map((source) => (
          <li key={`${source.name}-${source.country}`} className="flex items-start gap-3 py-3">
            {source.status === 'checked' ? (
              <CheckCircle2 className="mt-0.5 shrink-0 text-success" aria-hidden="true" />
            ) : source.status === 'unavailable' ? (
              <AlertCircle className="mt-0.5 shrink-0 text-warning" aria-hidden="true" />
            ) : (
              <MinusCircle className="mt-0.5 shrink-0 text-text-subtle" aria-hidden="true" />
            )}
            <div>
              <p className="font-medium text-text">{source.name}</p>
              <p className="text-small text-text-muted">{source.country}</p>
              <p className="mt-1 text-small font-medium text-text">
                {source.status === 'checked'
                  ? `Checked${source.records === undefined ? '' : ` · ${source.records} records found`}`
                  : source.status === 'unavailable'
                    ? 'Temporarily unavailable'
                    : 'Not covered'}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
