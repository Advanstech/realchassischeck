export function normaliseIdentifier(value: string): string {
  return value.replace(/[\s\u00a0]+/g, '').toUpperCase();
}

export function formatMoney(amount: number, currency: 'GHS'): string {
  if (currency !== 'GHS') throw new Error(`Unsupported currency: ${currency}`);
  return `GH₵${(amount / 100).toFixed(2)}`;
}

const GMT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

/**
 * Preview expiry is rendered by the server and hydrated by the browser, so it must not
 * go through `Intl`: Node and the browser ship different CLDR data for `en-GH` and
 * disagree on the time pattern ("20 Nov 2026, 6:18 pm GMT" vs "20 Nov 2026 at 6:18 PM
 * GMT"), which breaks hydration. Ghana is UTC+0 year-round, so fixed UTC arithmetic
 * gives both sides the same bytes. Keep `Intl` for server-only rendering.
 */
export function formatPreviewExpiry(value: string): string {
  const date = new Date(value);
  const hour24 = date.getUTCHours();
  const meridiem = hour24 < 12 ? 'AM' : 'PM';
  const hour = hour24 % 12 === 0 ? 12 : hour24 % 12;
  const minute = String(date.getUTCMinutes()).padStart(2, '0');
  return `${date.getUTCDate()} ${GMT_MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()} at ${hour}:${minute} ${meridiem} GMT`;
}
