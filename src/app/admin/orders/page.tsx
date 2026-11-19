import { ArrowLeft, ArrowUpRight, Download, Inbox, Search } from 'lucide-react';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { StatusChip } from '@/components/admin/status-chip';
import { buttonClass } from '@/components/ui/button';
import { Chip } from '@/components/ui/primitives';
import type { AdminOrder, OrderStatus } from '@/lib/admin/data';
import { loadOrders } from '@/lib/admin/source';
import { cn } from '@/lib/cn';
import { formatMoney } from '@/lib/lookup-utils';

const STATUSES: ReadonlyArray<OrderStatus> = ['paid', 'delivered', 'held', 'pending', 'refunded', 'failed'];

function isStatus(value: string): value is OrderStatus {
  return (STATUSES as ReadonlyArray<string>).includes(value);
}

function matches(order: AdminOrder, query: string): boolean {
  if (!query) return true;
  return [order.id, order.vehicle, order.vin, order.customer, order.phone]
    .join(' ')
    .toLowerCase()
    .includes(query);
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  readonly searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q = '', status = 'all' } = await searchParams;
  const t = await getTranslations('admin.orders');
  const columns = await getTranslations('admin.orders.columns');
  const nav = await getTranslations('admin');
  const units = await getTranslations('admin.units');

  const active = isStatus(status) ? status : 'all';
  const query = q.trim().toLowerCase();
  const feed = await loadOrders();
  const all = feed.data;
  const rows = all.filter((order) => (active === 'all' || order.status === active) && matches(order, query));
  const counts = STATUSES.map((value) => ({
    value,
    count: all.filter((order) => order.status === value).length,
  }));

  const filterHref = (next: string) => {
    const params = new URLSearchParams();
    if (next !== 'all') params.set('status', next);
    if (q.trim()) params.set('q', q.trim());
    const search = params.toString();
    return search ? `/admin/orders?${search}` : '/admin/orders';
  };

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link
            href="/admin"
            className="mb-2 inline-flex items-center gap-1.5 text-caption font-semibold text-text-muted no-underline hover:text-brand"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            {nav('nav.overview')}
          </Link>
          <h1 className="text-h1 font-extrabold text-brand">{t('title')}</h1>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-small text-text-muted">
            {t('note')}
            <span aria-hidden="true" className="text-border-strong">
              /
            </span>
            <span className="num font-semibold text-text">{t('count', { count: rows.length })}</span>
            {feed.sample ? (
              <span title={nav('sample.note')}>
                <Chip tone="warning">{nav('sample.label')}</Chip>
              </span>
            ) : null}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled
            title={t('exportSoon')}
            className={buttonClass('secondary', 'sm', 'cursor-not-allowed opacity-60')}
          >
            <Download className="size-4" aria-hidden="true" />
            {t('export')}
          </button>
        </div>
      </header>

      <section aria-label={t('filter')} className="panel flex flex-col gap-3 p-3 sm:p-4">
        <form action="/admin/orders" method="get" role="search" className="flex flex-col gap-2 sm:flex-row">
          {active !== 'all' ? <input type="hidden" name="status" value={active} /> : null}
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-subtle"
              aria-hidden="true"
            />
            <input
              type="search"
              name="q"
              defaultValue={q}
              aria-label={t('search')}
              placeholder={t('search')}
              className="h-11 w-full rounded-md border border-hairline bg-bg-subtle pl-9 pr-3 text-small text-text placeholder:text-text-subtle focus:border-brand/40 focus:bg-surface focus:outline-none focus:ring-4 focus:ring-brand/10"
            />
          </div>
          <button type="submit" className={buttonClass('secondary', 'sm', 'sm:min-h-11')}>
            {t('searchAction')}
          </button>
        </form>

        <div className="-mx-1 flex items-center gap-1.5 overflow-x-auto px-1 pb-1">
          <span className="mr-1 hidden text-caption font-semibold uppercase tracking-wide text-text-subtle sm:inline">
            {t('filter')}
          </span>
          <Link
            href={filterHref('all')}
            aria-current={active === 'all' ? 'page' : undefined}
            className={filterClass(active === 'all')}
          >
            {t('all')}
            <span className="num text-[11px] font-bold text-text-subtle">{all.length}</span>
          </Link>
          {counts.map(({ value, count }) => (
            <Link
              key={value}
              href={filterHref(value)}
              aria-current={active === value ? 'page' : undefined}
              className={filterClass(active === value)}
            >
              {t(`status.${value}`)}
              <span className="num text-[11px] font-bold text-text-subtle">{count}</span>
            </Link>
          ))}
        </div>
      </section>

      {rows.length === 0 ? (
        <div className="panel flex flex-col items-center gap-3 px-6 py-16 text-center">
          <span className="grid size-12 place-items-center rounded-full bg-bg-subtle text-text-subtle">
            <Inbox className="size-6" aria-hidden="true" />
          </span>
          <p className="text-body font-semibold text-brand">{t('empty')}</p>
          <Link href="/admin/orders" className={buttonClass('secondary', 'sm')}>
            {t('clear')}
          </Link>
        </div>
      ) : (
        <>
          {/* 360px: one card per order, the row data stacked in reading order. */}
          <ul className="flex flex-col gap-2 md:hidden">
            {rows.map((order) => (
              <li key={order.id} className="panel p-4">
                <div className="flex items-start justify-between gap-3">
                  <Link href={`/admin/orders/${order.id}`} className="num text-small font-bold text-brand no-underline">
                    {order.id}
                  </Link>
                  <StatusChip status={order.status} />
                </div>
                <p className="mt-2 text-small font-semibold text-text">{order.vehicle}</p>
                <p className="mt-0.5 text-caption text-text-subtle">
                  {order.customer} · {order.method}
                </p>
                {order.issue ? <p className="mt-2 text-caption font-semibold text-warning-ink">{order.issue}</p> : null}
                <div className="mt-3 flex items-center justify-between border-t border-hairline pt-3">
                  <span className="num text-small font-bold text-brand">{formatMoney(order.amount, 'GHS')}</span>
                  <span className="num text-caption text-text-subtle">{order.ageMinutes} {units('min')}</span>
                </div>
              </li>
            ))}
          </ul>

          <div className="panel hidden overflow-hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <caption className="sr-only">{t('title')}</caption>
                <thead>
                  <tr className="border-b border-hairline bg-bg-subtle">
                    {(['order', 'vehicle', 'customer', 'method', 'amount', 'status', 'age'] as const).map((key) => (
                      <th
                        key={key}
                        scope="col"
                        className={cn(
                          'whitespace-nowrap px-4 py-2.5 text-caption font-semibold uppercase tracking-wide text-text-subtle',
                          (key === 'amount' || key === 'age') && 'text-right',
                        )}
                      >
                        {columns(key)}
                      </th>
                    ))}
                    <th scope="col" className="w-10 px-2">
                      <span className="sr-only">{t('open')}</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((order) => (
                    <tr
                      key={order.id}
                      className="group border-b border-hairline transition-colors duration-150 last:border-0 hover:bg-bg-subtle/60"
                    >
                      <th scope="row" className="whitespace-nowrap px-4 py-3 text-left font-normal">
                        <Link href={`/admin/orders/${order.id}`} className="num text-small font-semibold text-brand no-underline">
                          {order.id}
                        </Link>
                        {order.issue ? (
                          <span className="mt-1 flex items-center gap-1.5 text-caption font-medium text-warning-ink">
                            <span aria-hidden="true" className="size-1.5 rounded-full bg-warning" />
                            {order.issue}
                          </span>
                        ) : (
                          <span className="mt-1 block text-caption text-text-subtle">{order.phone}</span>
                        )}
                      </th>
                      <td className="px-4 py-3">
                        <span className="block text-small font-medium text-text">{order.vehicle}</span>
                        <span className="mt-0.5 block font-mono text-[11px] uppercase tracking-tight text-text-subtle">
                          {order.vin}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-small text-text">{order.customer}</td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <Chip tone="neutral">{order.method}</Chip>
                      </td>
                      <td className="num whitespace-nowrap px-4 py-3 text-right text-small font-semibold text-text">
                        {formatMoney(order.amount, 'GHS')}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <StatusChip status={order.status} />
                      </td>
                      <td className="num whitespace-nowrap px-4 py-3 text-right text-small text-text-muted">
                        {order.ageMinutes} {units('min')}
                      </td>
                      <td className="px-2 py-3 text-right">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          aria-label={`${t('open')} ${order.id}`}
                          className="grid size-9 place-items-center rounded-md text-text-subtle no-underline transition-colors hover:bg-surface hover:text-brand group-hover:text-brand"
                        >
                          <ArrowUpRight className="size-4" aria-hidden="true" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function filterClass(active: boolean): string {
  return cn(
    'flex min-h-9 shrink-0 items-center gap-1.5 rounded-full border px-3 text-caption font-semibold no-underline transition-colors duration-150',
    active
      ? 'border-brand bg-brand text-on-brand'
      : 'border-hairline bg-surface text-text-muted hover:border-border-strong hover:text-brand',
  );
}
