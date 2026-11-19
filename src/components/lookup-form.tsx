'use client';

import { useMutation } from '@tanstack/react-query';
import { ArrowRight, CheckCircle2, LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/primitives';
import { trackEvent } from '@/lib/analytics';
import { ApiRequestError, createLookup, type CreateLookupInput } from '@/lib/api';
import { VinField } from './vin-field';

const COUNTRIES = ['usa', 'canada', 'europe', 'japan', 'uae', 'china', 'other'] as const;

/** The signature "checking" moment: each source ticks in turn while the answer loads. */
function CheckingSequence({ note, steps }: { readonly note: string; readonly steps: ReadonlyArray<string> }) {
  const [done, setDone] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setDone((value) => Math.min(steps.length, value + 1)), 900);
    return () => window.clearInterval(timer);
  }, [steps.length]);

  return (
    <div role="status" aria-live="polite" className="rounded-md border border-hairline bg-bg-subtle p-4">
      <p className="text-small text-text-muted">{note}</p>
      <ul className="mt-3 flex flex-col gap-2">
        {steps.map((step, index) => {
          const complete = index < done;
          const running = index === done;
          return (
            <li key={step} className="flex items-center gap-3 text-small font-medium">
              {complete ? (
                <CheckCircle2 className="size-4 shrink-0 text-success" aria-hidden="true" />
              ) : running ? (
                <span className="relative grid size-4 shrink-0 place-items-center" aria-hidden="true">
                  <span className="absolute inset-0 rounded-full bg-cta/25 animate-pulse-ring" />
                  <LoaderCircle className="size-4 animate-spin text-cta" />
                </span>
              ) : (
                <span className="size-4 shrink-0 rounded-full border border-border-strong" aria-hidden="true" />
              )}
              <span className={complete || running ? 'text-text' : 'text-text-subtle'}>{step}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function LookupForm() {
  const t = useTranslations('lookup');
  const router = useRouter();
  const steps = t.raw('steps') as ReadonlyArray<string>;
  const [identifier, setIdentifier] = useState('');
  const [shippingFrom, setShippingFrom] = useState<CreateLookupInput['shippingFrom']>('not_sure');
  const [localError, setLocalError] = useState('');
  const [slow, setSlow] = useState(false);
  const controller = useRef<AbortController | null>(null);

  const lookup = useMutation({
    mutationFn: ({ signal }: { signal: AbortSignal }) => createLookup({ identifier, shippingFrom }, signal),
    onSuccess: (preview) => {
      trackEvent('lookup_completed', { status: preview.status });
      router.push(`/preview/${preview.publicId}`);
    },
    onError: (error) => {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      trackEvent('lookup_failed', {
        code: error instanceof ApiRequestError ? error.body.code : 'NETWORK_ERROR',
      });
    },
  });

  useEffect(() => {
    if (!lookup.isPending) return;
    const timer = window.setTimeout(() => {
      setSlow(true);
      controller.current?.abort();
    }, 8_000);
    return () => window.clearTimeout(timer);
  }, [lookup.isPending, lookup.submittedAt]);

  useEffect(() => () => controller.current?.abort(), []);

  function runCheck() {
    if (!identifier) {
      setLocalError(t('error'));
      return;
    }
    setLocalError('');
    setSlow(false);
    controller.current?.abort();
    controller.current = new AbortController();
    trackEvent('lookup_started', { shippingFrom: shippingFrom ?? 'not_sure' });
    lookup.mutate({ signal: controller.current.signal });
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    runCheck();
  }

  const error = localError || (lookup.error instanceof ApiRequestError ? lookup.error.message : '');
  const networkError =
    lookup.error
    && !(lookup.error instanceof ApiRequestError)
    && !(lookup.error instanceof DOMException && lookup.error.name === 'AbortError');

  return (
    <form
      onSubmit={submit}
      className="relative rounded-xl border border-hairline bg-surface p-5 shadow-e4 sm:p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-h3 font-bold tracking-tight text-brand max-sm:text-base">{t('title')}</p>
        <Chip tone="success" className="shrink-0">{t('free')}</Chip>
      </div>

      <div className="mt-5 flex flex-col gap-5">
        <VinField
          value={identifier}
          onChange={(value) => {
            setIdentifier(value);
            setLocalError('');
            lookup.reset();
          }}
          disabled={lookup.isPending}
          error={error}
        />

        {!lookup.isPending ? (
          <div className="flex flex-col gap-2">
            <label htmlFor="shipping-from" className="text-small font-semibold text-text">
              {t('shippingLabel')} <span className="font-normal text-text-subtle">{t('shippingOptional')}</span>
            </label>
            <select
              id="shipping-from"
              className="h-12 w-full rounded-md border border-border-strong bg-surface px-3 text-small text-text hover:border-brand/40 focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/10 disabled:opacity-60"
              value={shippingFrom}
              onChange={(event) => setShippingFrom(event.target.value as CreateLookupInput['shippingFrom'])}
              disabled={lookup.isPending}
            >
              <option value="not_sure">{t('notSure')}</option>
              {COUNTRIES.map((country) => (
                <option key={country} value={country}>
                  {t(`countries.${country}`)}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        {networkError ? (
          <p role="alert" className="rounded-md border border-danger/25 bg-danger-bg p-3 text-small text-danger-ink">
            {t('networkError')}
          </p>
        ) : null}

        <Button type="submit" size="lg" loading={lookup.isPending} className="w-full">
          {lookup.isPending ? t('submitting') : t('submit')}
          {lookup.isPending ? null : <ArrowRight className="size-5" aria-hidden="true" />}
        </Button>

        {lookup.isPending ? <CheckingSequence note={t('checkingNote')} steps={steps} /> : null}

        {slow ? (
          <div className="rounded-md border border-warning/30 bg-warning-bg p-3 text-small text-warning-ink" role="alert">
            <p>{t('slow')}</p>
            <button type="button" className="mt-2 min-h-11 font-semibold underline" onClick={runCheck}>
              {t('retry')}
            </button>
          </div>
        ) : null}
      </div>
    </form>
  );
}
