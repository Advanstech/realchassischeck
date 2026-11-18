import type { PreviewPayload } from '@/lib/api';

const LABELS: ReadonlyArray<readonly [keyof PreviewPayload['counts'], string]> = [
  ['accidents', 'Accident records'],
  ['theft', 'Theft records'],
  ['title_brands', 'Title brands'],
  ['sales', 'Sale listings'],
  ['recalls', 'Open recalls'],
  ['service', 'Service records'],
];

export function RecordChips({ counts }: { readonly counts: PreviewPayload['counts'] }) {
  const records = LABELS.flatMap(([key, label]) => {
    const count = counts[key];
    return count ? [{ key, label, count }] : [];
  });
  if (records.length === 0) return null;
  return (
    <section aria-labelledby="record-counts-title">
      <h2 id="record-counts-title" className="text-h3 font-semibold text-brand">
        Records found
      </h2>
      <p className="mt-1 text-small text-text-muted">Counts only. Dates and record details are inside the paid report.</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {records.map((record) => (
          <li key={record.key} className="rounded-full bg-info-bg px-3 py-2 text-small font-medium text-info-ink">
            {record.count} {record.label.toLowerCase()}
          </li>
        ))}
      </ul>
    </section>
  );
}
