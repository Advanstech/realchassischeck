'use client';

export type AnalyticsEvent =
  | 'lookup_started'
  | 'lookup_completed'
  | 'lookup_failed'
  | 'preview_viewed'
  | 'lead_submitted';

/** First-party instrumentation only: never include a VIN, contact, IP or public link. */
export function trackEvent(name: AnalyticsEvent, properties: Record<string, string> = {}): void {
  const detail = { name, properties, occurredAt: new Date().toISOString() };
  const target = window as Window & { dataLayer?: Record<string, unknown>[] };
  target.dataLayer?.push({ event: name, ...properties });
  window.dispatchEvent(new CustomEvent('rcc:analytics', { detail }));
}
