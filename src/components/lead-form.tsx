'use client';

import { useMutation } from '@tanstack/react-query';
import { useState, type FormEvent } from 'react';
import { trackEvent } from '@/lib/analytics';
import { ApiRequestError, createLead } from '@/lib/api';

interface LeadFormProps {
  readonly sourceWanted: string;
  readonly vin: string;
}

export function LeadForm({ sourceWanted, vin }: LeadFormProps) {
  const [contact, setContact] = useState('');
  const [idempotencyKey] = useState(() => crypto.randomUUID());
  const lead = useMutation({
    mutationFn: () => createLead({ contact, sourceWanted, vin }, idempotencyKey),
    onSuccess: () => trackEvent('lead_submitted', { sourceWanted }),
  });

  function submit(event: FormEvent) {
    event.preventDefault();
    lead.mutate();
  }

  if (lead.isSuccess) {
    return (
      <div role="status" className="rounded-md bg-success-bg p-4 text-success-ink">
        <p className="font-semibold">Thanks — your interest is registered.</p>
        <p className="mt-1 text-small">We’ll use your contact only to follow up on this source.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-4 flex flex-col gap-3">
      <label htmlFor={`lead-contact-${sourceWanted}`} className="font-semibold text-text">
        Email address or phone number
      </label>
      <input
        id={`lead-contact-${sourceWanted}`}
        className="w-full rounded-md border border-border-strong bg-surface px-4 text-text disabled:opacity-60"
        value={contact}
        onChange={(event) => setContact(event.target.value)}
        minLength={5}
        maxLength={160}
        required
        disabled={lead.isPending}
        autoComplete="off"
      />
      {lead.error ? (
        <p role="alert" className="text-small text-danger-ink">
          {lead.error instanceof ApiRequestError
            ? lead.error.message
            : 'We could not save your request. Check your connection and try again.'}
        </p>
      ) : null}
      <button
        type="submit"
        className="min-h-12 rounded-md bg-brand px-5 font-semibold text-on-brand disabled:opacity-60"
        disabled={lead.isPending}
      >
        {lead.isPending ? 'Registering…' : 'Notify me about this source'}
      </button>
    </form>
  );
}
