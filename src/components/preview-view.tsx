import { AlertTriangle, ArrowLeft, CheckCircle2, ExternalLink, FileSearch, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import type { PreviewPayload } from '@/lib/api';
import { formatMoney, formatPreviewExpiry } from '@/lib/lookup-utils';
import { CoverageList } from './coverage-list';
import { LeadForm } from './lead-form';
import { RecordChips } from './record-chips';

const STATUS: Record<PreviewPayload['status'], { title: string; description: string; className: string }> = {
  records_found: {
    title: 'We found records for this vehicle',
    description: 'The free check found record counts. Review what the full report includes before you decide to buy.',
    className: 'bg-success-bg text-success-ink',
  },
  no_records: {
    title: 'No records found in the sources checked',
    description: 'There is nothing to buy. This does not prove the vehicle has a clean history; use the free official tools below too.',
    className: 'bg-info-bg text-info-ink',
  },
  europe_referral: {
    title: 'This vehicle needs a European history source',
    description: 'Our US check returned no records. We are confirming a European partner, so there is nothing to buy here yet.',
    className: 'bg-info-bg text-info-ink',
  },
  japan_not_covered: {
    title: 'Japanese chassis checks are not covered yet',
    description: 'We accepted the chassis number, but we do not have a Japanese records source in this phase. You will not be charged.',
    className: 'bg-warning-bg text-warning-ink',
  },
  provider_unavailable: {
    title: 'The vehicle records source is unavailable',
    description: 'This source has been switched off. You cannot buy a report now, and no charge has been made.',
    className: 'bg-warning-bg text-warning-ink',
  },
  provider_error: {
    title: 'We could not complete the free check',
    description: 'The records provider did not respond after a retry. No charge has been made. Please try again shortly.',
    className: 'bg-danger-bg text-danger-ink',
  },
};

export function PreviewView({ preview }: { readonly preview: PreviewPayload }) {
  const status = STATUS[preview.status];
  const showLead = preview.status === 'japan_not_covered' || preview.status === 'europe_referral';
  const sourceWanted = preview.status === 'europe_referral' ? 'europe' : 'japan';

  return (
    <div className="flex flex-col gap-6">
      <Link href="/" className="flex min-h-11 w-fit items-center gap-2 font-medium">
        <ArrowLeft aria-hidden="true" /> Check another vehicle
      </Link>

      <section className={`rounded-lg p-5 ${status.className}`} aria-labelledby="preview-status">
        <div className="flex items-start gap-3">
          {preview.status === 'records_found' ? (
            <CheckCircle2 className="mt-1 shrink-0" aria-hidden="true" />
          ) : (
            <FileSearch className="mt-1 shrink-0" aria-hidden="true" />
          )}
          <div>
            <h1 id="preview-status" className="text-h2 font-semibold">{status.title}</h1>
            <p className="mt-2">{status.description}</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="vehicle-title" className="rounded-lg border border-border bg-surface p-5">
        <h2 id="vehicle-title" className="text-small font-medium uppercase tracking-wide text-text-muted">You checked</h2>
        <p className="vin mt-2 break-all text-body font-semibold text-brand sm:text-h3">{preview.displayIdentifier}</p>
        {preview.hint ? <p className="mt-3 rounded-md bg-warning-bg p-3 text-small text-warning-ink">{preview.hint}</p> : null}
        {preview.decode ? (
          <div className="mt-5">
            <h3 className="text-h3 font-semibold text-brand">
              {preview.decode.year} {preview.decode.make} {preview.decode.model}
            </h3>
            <dl className="mt-3 grid grid-cols-1 gap-3 text-small sm:grid-cols-2">
              <div><dt className="text-text-muted">Built in</dt><dd className="font-medium text-text">{preview.decode.buildCountry}</dd></div>
              {preview.decode.body ? <div><dt className="text-text-muted">Body</dt><dd className="font-medium text-text">{preview.decode.body}</dd></div> : null}
              {preview.decode.engine ? <div><dt className="text-text-muted">Engine</dt><dd className="font-medium text-text">{preview.decode.engine}</dd></div> : null}
              {preview.decode.trim ? <div><dt className="text-text-muted">Trim</dt><dd className="font-medium text-text">{preview.decode.trim}</dd></div> : null}
            </dl>
          </div>
        ) : null}
        {preview.originOverridden ? (
          <p className="mt-4 text-small text-info-ink">The provider’s decoded build country differs from the VIN prefix; the decoded value is shown.</p>
        ) : null}
      </section>

      {preview.status === 'records_found' ? (
        <>
          <RecordChips counts={preview.counts} />
          <section className="grid gap-5 md:grid-cols-2">
            <div className="rounded-lg border border-border bg-surface p-5">
              <h2 className="text-h3 font-semibold text-brand">Full vehicle history report</h2>
              <p className="mt-3 text-h1 font-semibold text-brand">{formatMoney(preview.price.amount, preview.price.currency)}</p>
              <p className="mt-1 text-small text-text-muted">One report. No subscription.</p>
              <button type="button" className="mt-5 min-h-12 w-full rounded-md bg-cta px-5 font-semibold text-on-cta disabled:cursor-not-allowed disabled:opacity-60" disabled aria-describedby="checkout-note">
                Continue to secure checkout
              </button>
              <p id="checkout-note" className="mt-2 text-small text-text-muted">Checkout will be enabled with the payment milestone.</p>
            </div>
            <div className="rounded-lg border border-border bg-surface p-5">
              <h2 className="text-h3 font-semibold text-brand">What the report includes</h2>
              <ul className="mt-3 flex flex-col gap-2">
                {preview.reportIncludes.map((item) => (
                  <li key={item} className="flex gap-2 text-small text-text"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />{item}</li>
                ))}
              </ul>
            </div>
          </section>
        </>
      ) : null}

      {preview.status === 'no_records' ? (
        <section className="rounded-lg border border-border bg-surface p-5" aria-labelledby="free-tools-title">
          <h2 id="free-tools-title" className="text-h3 font-semibold text-brand">Free official tools to try next</h2>
          <ul className="mt-3 flex flex-col gap-4">
            {preview.freeTools.map((tool) => (
              <li key={tool.url}>
                <a href={tool.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 font-semibold">
                  {tool.name}<ExternalLink className="size-4" aria-hidden="true" />
                </a>
                <p className="text-small text-text-muted">{tool.note}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {showLead ? (
        <section className="rounded-lg border border-border bg-surface p-5" aria-labelledby="lead-title">
          <h2 id="lead-title" className="text-h3 font-semibold text-brand">Help us prioritise this source</h2>
          <p className="mt-2 text-small text-text-muted">Leave your email address or phone number if you want an update. This is optional and does not create an order.</p>
          <LeadForm sourceWanted={sourceWanted} vin={preview.identifier} />
        </section>
      ) : null}

      <CoverageList sources={preview.coverage} />

      {preview.gsaNotice ? (
        <aside className="flex gap-3 rounded-lg border border-warning bg-warning-bg p-4 text-warning-ink" aria-label="Ghana import notice">
          <AlertTriangle className="mt-0.5 shrink-0" aria-hidden="true" />
          <div><h2 className="font-semibold">Before you import</h2><p className="mt-1 text-small">{preview.gsaNotice}</p></div>
        </aside>
      ) : null}

      <div className="flex items-start gap-2 text-small text-text-muted">
        <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <p>This preview link expires on {formatPreviewExpiry(preview.expiresAt)}. It contains vehicle information, not your contact details.</p>
      </div>
    </div>
  );
}
