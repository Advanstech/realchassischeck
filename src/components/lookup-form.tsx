'use client';

import { useMutation } from '@tanstack/react-query';
import { ArrowRight, LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { trackEvent } from '@/lib/analytics';
import { ApiRequestError, createLookup, type CreateLookupInput } from '@/lib/api';
import { VinField } from './vin-field';

export function LookupForm() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [shippingFrom, setShippingFrom] = useState<CreateLookupInput['shippingFrom']>('not_sure');
  const [localError, setLocalError] = useState('');
  const [slow, setSlow] = useState(false);
  const controller = useRef<AbortController | null>(null);
  const lookup = useMutation({
    mutationFn: ({ signal }: { signal: AbortSignal }) =>
      createLookup({ identifier, shippingFrom }, signal),
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
    const timer = window.setTimeout(() => setSlow(true), 8_000);
    return () => window.clearTimeout(timer);
  }, [lookup.isPending, lookup.submittedAt]);

  useEffect(() => () => controller.current?.abort(), []);

  function runCheck() {
    if (!identifier) {
      setLocalError('Enter your VIN or chassis number.');
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
  const networkError = lookup.error && !(lookup.error instanceof ApiRequestError);

  return (
    <form onSubmit={submit} className="flex flex-col gap-5 rounded-lg border border-border bg-surface p-5 shadow-e2 sm:p-6">
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
      <div className="flex flex-col gap-2">
        <label htmlFor="shipping-from" className="font-semibold text-text">
          Where are you importing from? <span className="font-normal text-text-muted">(optional)</span>
        </label>
        <select
          id="shipping-from"
          className="w-full rounded-md border border-border-strong bg-surface px-3 text-text disabled:opacity-60"
          value={shippingFrom}
          onChange={(event) => setShippingFrom(event.target.value as CreateLookupInput['shippingFrom'])}
          disabled={lookup.isPending}
        >
          <option value="not_sure">I’m not sure</option>
          <option value="usa">United States</option>
          <option value="canada">Canada</option>
          <option value="europe">Europe</option>
          <option value="japan">Japan</option>
          <option value="uae">United Arab Emirates</option>
          <option value="china">China</option>
          <option value="other">Another country</option>
        </select>
      </div>
      {networkError ? (
        <p role="alert" className="rounded-md bg-danger-bg p-3 text-small text-danger-ink">
          We could not reach the check service. Check your connection and try again.
        </p>
      ) : null}
      <button
        type="submit"
        className="flex min-h-12 items-center justify-center gap-2 rounded-md bg-cta px-5 font-semibold text-on-cta hover:bg-cta-hover disabled:cursor-not-allowed disabled:opacity-70"
        disabled={lookup.isPending}
      >
        {lookup.isPending ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}
        {lookup.isPending ? 'Checking available records…' : 'Run a free check'}
      </button>
      {lookup.isPending ? (
        <div className="text-center text-small text-text-muted" role="status" aria-live="polite">
          <p>We’re decoding the vehicle and checking record counts. No payment is taken.</p>
          {slow ? (
            <div className="mt-3 rounded-md bg-warning-bg p-3 text-warning-ink">
              <p>This is taking longer than expected. You can wait or start the request again.</p>
              <button type="button" className="mt-2 min-h-11 font-semibold underline" onClick={runCheck}>
                Try again
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
