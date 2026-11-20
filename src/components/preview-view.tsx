'use client';

import { AlertTriangle, ArrowLeft, CheckCircle2, ExternalLink, FileSearch, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Banner, Chip, Eyebrow, type Tone } from '@/components/ui/primitives';
import type { PreviewPayload } from '@/lib/api';
import { cn } from '@/lib/cn';
import { formatMoney, formatPreviewExpiry } from '@/lib/lookup-utils';
import { CoverageList } from './coverage-list';
import { LeadForm } from './lead-form';
import { RecordChips } from './record-chips';

const CHIP_TONE: Record<PreviewPayload['status'], Tone> = {
  records_found: 'success',
  no_records: 'info',
  europe_referral: 'info',
  japan_not_covered: 'warning',
  provider_unavailable: 'warning',
  provider_error: 'danger',
};

export function PreviewView({ preview }: { readonly preview: PreviewPayload }) {
  const t = useTranslations('preview');
  const [vehicleConfirmed, setVehicleConfirmed] = useState(false);
  const showLead = preview.status === 'japan_not_covered' || preview.status === 'europe_referral';
  const sourceWanted = preview.status === 'europe_referral' ? 'europe' : 'japan';
  // M2 owns payment activation; it must not bypass this M1 confirmation gate.
  const checkoutEnabled = false;
  const includes = t.raw('includes') as ReadonlyArray<string>;
  const money = formatMoney(preview.price.amount, preview.price.currency);
  const isRecordsFound = preview.status === 'records_found';
  const StatusIcon = isRecordsFound ? CheckCircle2 : preview.status === 'provider_error' ? AlertTriangle : FileSearch;

  const priceCard = (
    <article className="panel-raised p-6">
      <p className="text-eyebrow font-semibold uppercase text-text-subtle">{t('buyTitle')}</p>
      <p className="num mt-3 text-display font-extrabold text-brand">{money}</p>
      <p className="mt-1 text-small text-text-muted">{t('buyNote')}</p>
      <Button
        variant="primary"
        size="lg"
        className="mt-5 w-full"
        disabled={!vehicleConfirmed || !checkoutEnabled}
        aria-describedby="checkout-note"
      >
        {t('buyCta')}
      </Button>
      <p id="checkout-note" className="mt-2 text-caption text-text-subtle">
        {t('checkoutNote')}
      </p>
      <div className="my-5 hairline-x" />
      <h2 className="text-small font-bold text-brand">{t('includesTitle')}</h2>
      <ul className="mt-3 flex flex-col gap-2">
        {includes.map((item) => (
          <li key={item} className="flex gap-2 text-small text-text">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    </article>
  );

  return (
    <div className="pb-28 lg:pb-0">
      <section className="hero-canvas hero-grid relative isolate overflow-hidden text-on-inverse">
        <div className="mx-auto w-full max-w-[1400px] px-4 pb-10 pt-3 sm:px-6 sm:pb-14 lg:px-8">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-2 rounded-sm text-small font-semibold text-navy-100 no-underline transition-colors duration-150 hover:text-white"
          >
            <ArrowLeft className="size-4" aria-hidden="true" /> {t('back')}
          </Link>

          <div className="mt-6 grid items-end gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] lg:gap-12">
            <div>
              <Eyebrow tone="inverse">{t('eyebrow')}</Eyebrow>
              <h1 className="mt-4 text-h1 font-extrabold text-balance">{t(`status.${preview.status}.title`)}</h1>
              <p className="mt-3 max-w-[64ch] text-body text-on-inverse-muted">{t(`status.${preview.status}.body`)}</p>
              <div className="mt-5">
                <Chip tone={CHIP_TONE[preview.status]}>
                  <StatusIcon className="size-3.5" aria-hidden="true" />
                  {t(`status.${preview.status}.chip`)}
                </Chip>
              </div>
            </div>

            <div className="rounded-sheet border border-white/10 bg-white/5 p-5 backdrop-blur-sm sm:p-6">
              <p className="text-eyebrow font-semibold uppercase text-navy-300">{t('youChecked')}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2.5">
                <p className="vin text-h3 font-semibold text-on-inverse">
                  {preview.displayIdentifier.replace(/\s+/g, '')}
                </p>
                {preview.decode ? (
                  <Chip tone="inverse">
                    <CheckCircle2 className="size-3.5" aria-hidden="true" />
                    {t('decoded')}
                  </Chip>
                ) : null}
              </div>
              {preview.decode ? (
                <p className="mt-3 text-h2 font-extrabold text-balance">
                  {preview.decode.year} {preview.decode.make} {preview.decode.model}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div
          className={cn(
            'grid items-start gap-6 lg:gap-8',
            isRecordsFound && 'lg:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.85fr)]',
          )}
        >
          <div className="flex min-w-0 flex-col gap-6">
            {preview.decode || preview.hint ? (
              <section aria-labelledby="vehicle-title" className="panel-raised p-5 sm:p-6">
                <h2 id="vehicle-title" className="text-h3 font-bold text-brand">
                  {t('detailsTitle')}
                </h2>
                {preview.hint ? (
                  <Banner tone="warning" title={t('checkVin')} className="mt-4">
                    {preview.hint}
                  </Banner>
                ) : null}

                {preview.decode ? (
                  <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-hairline pt-4 text-small sm:grid-cols-4">
                    <div>
                      <dt className="text-caption text-text-subtle">{t('labels.built')}</dt>
                      <dd className="font-semibold text-text">{preview.decode.buildCountry}</dd>
                    </div>
                    {preview.decode.body ? (
                      <div>
                        <dt className="text-caption text-text-subtle">{t('labels.body')}</dt>
                        <dd className="font-semibold text-text">{preview.decode.body}</dd>
                      </div>
                    ) : null}
                    {preview.decode.engine ? (
                      <div>
                        <dt className="text-caption text-text-subtle">{t('labels.engine')}</dt>
                        <dd className="font-semibold text-text">{preview.decode.engine}</dd>
                      </div>
                    ) : null}
                    {preview.decode.trim ? (
                      <div>
                        <dt className="text-caption text-text-subtle">{t('labels.trim')}</dt>
                        <dd className="font-semibold text-text">{preview.decode.trim}</dd>
                      </div>
                    ) : null}
                  </dl>
                ) : null}

                {preview.originOverridden ? <p className="mt-4 text-small text-info-ink">{t('originNote')}</p> : null}

                {isRecordsFound ? (
                  <div className="mt-5 border-t border-hairline pt-5">
                    <p id="vehicle-confirmation-hint" className="text-caption text-text-muted">
                      {t('confirmHint')}
                    </p>
                    <label className="mt-3 flex min-h-11 cursor-pointer items-center gap-3 font-semibold text-text">
                      <input
                        type="checkbox"
                        className="size-5 min-h-5 shrink-0 accent-brand"
                        checked={vehicleConfirmed}
                        onChange={(event) => setVehicleConfirmed(event.target.checked)}
                        aria-describedby="vehicle-confirmation-hint"
                      />
                      {t('confirm')}
                    </label>
                  </div>
                ) : null}
              </section>
            ) : null}

            {isRecordsFound ? <RecordChips counts={preview.counts} /> : null}

            {preview.status === 'no_records' ? (
              <section className="panel-raised p-5 sm:p-6" aria-labelledby="free-tools-title">
                <h2 id="free-tools-title" className="text-h3 font-bold text-brand">
                  {t('freeToolsTitle')}
                </h2>
                <ul className="mt-3 flex flex-col gap-4">
                  {preview.freeTools.map((tool) => (
                    <li key={tool.url}>
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-11 items-center gap-2 font-semibold"
                      >
                        {tool.name}
                        <ExternalLink className="size-4" aria-hidden="true" />
                      </a>
                      <p className="text-small text-text-muted">{tool.note}</p>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {showLead ? (
              <section className="panel-raised p-5 sm:p-6" aria-labelledby="lead-title">
                <h2 id="lead-title" className="text-h3 font-bold text-brand">
                  {t('leadTitle')}
                </h2>
                <p className="mt-2 text-small text-text-muted">{t('leadNote')}</p>
                <LeadForm sourceWanted={sourceWanted} vin={preview.identifier} />
              </section>
            ) : null}

            <CoverageList sources={preview.coverage} />

            {preview.gsaNotice ? (
              <Banner tone="warning" title={t('gsaTitle')}>
                {preview.gsaNotice}
              </Banner>
            ) : null}

            <div className="flex items-start gap-2 text-caption text-text-subtle">
              <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <p>{t('expiry', { date: formatPreviewExpiry(preview.expiresAt) })}</p>
            </div>
          </div>

          {isRecordsFound ? <aside className="hidden lg:sticky lg:top-24 lg:block">{priceCard}</aside> : null}
        </div>
      </div>

      {isRecordsFound ? (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-hairline bg-surface/95 p-3 backdrop-blur lg:hidden">
          <div className="mx-auto flex max-w-[1400px] items-center gap-4">
            <div className="shrink-0">
              <p className="text-caption text-text-subtle">{t('priceLabel')}</p>
              <p className="num text-h3 font-extrabold text-brand">{money}</p>
            </div>
            <Button variant="primary" className="flex-1" disabled={!vehicleConfirmed || !checkoutEnabled}>
              {t('buyCta')}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
