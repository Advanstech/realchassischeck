export function normaliseIdentifier(value: string): string {
  return value.replace(/[\s\u00a0]+/g, '').toUpperCase();
}

export function formatMoney(amount: number, currency: 'GHS'): string {
  if (currency !== 'GHS') throw new Error(`Unsupported currency: ${currency}`);
  return `GH₵${(amount / 100).toFixed(2)}`;
}

export function formatPreviewExpiry(value: string): string {
  const formatted = new Intl.DateTimeFormat('en-GH', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'GMT',
  }).format(new Date(value));
  return `${formatted} GMT`;
}
