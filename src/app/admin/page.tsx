import { ArrowRight, CircleDot } from 'lucide-react';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Funnel } from '@/components/admin/funnel';
import { KpiTile } from '@/components/admin/kpi-tile';
import { LiveFeed } from '@/components/admin/live-feed';
import { SalesChart } from '@/components/admin/sales-chart';
import { StatusChip } from '@/components/admin/status-chip';
import { buttonClass } from '@/components/ui/button';
import { funnel, kpis, liveEvents, orders, salesSeries } from '@/lib/admin/data';
import { formatMoney } from '@/lib/lookup-utils';

export default async function AdminOverviewPage() {
  const t = await getTranslations('admin.overview');
  const columns = await getTranslations('admin.orders.columns');
  const funnelLabels = t.raw('funnel') as ReadonlyArray<string>;
  const attention = orders.filter((order) => order.issue).slice(0, 3);
  const rows = funnel.map((item, index) => ({ key: funnelLabels[index] ?? item.key, value: item.value }));

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-h1 font-extrabold text-brand">{t('title')}</h1>
          <p className="mt-1 text-small text-text-muted">{t('note')}</p>
        </div>
        <Link href="/admin/orders" className={buttonClass('secondary', 'sm')}>
          {t('viewAll')}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </header>

      <section aria-label={t('title')} className="grid grid-cols-2 gap-3 xl:grid-cols-5">
        {kpis.map((kpi) => (
          <KpiTile
            key={kpi.key}
            label={t(`kpi.${kpi.key}`)}
            value={kpi.value}
            delta={t(`delta.${kpi.deltaKey}`)}
            trend={kpi.trend}
            spark={kpi.spark}
          />
        ))}
      </section>

      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <section aria-labelledby="sales-title" className="panel p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="sales-title" className="text-h3 font-bold text-brand">
              {t('chartTitle')}
            </h2>
            <p className="num text-small font-semibold text-text-muted">{t('chartNote')}</p>
          </div>
          <SalesChart series={salesSeries} />
        </section>

        <section aria-labelledby="funnel-title" className="panel p-5">
          <h2 id="funnel-title" className="text-h3 font-bold text-brand">
            {t('funnelTitle')}
          </h2>
          <Funnel items={rows} />
        </section>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <section aria-labelledby="attention-title" className="panel overflow-hidden">
          <div className="flex flex-wrap items-baseline justify-between gap-2 p-5 pb-3">
            <h2 id="attention-title" className="text-h3 font-bold text-brand">
              {t('attentionTitle')}
            </h2>
            <p className="text-caption text-text-subtle">{t('attentionNote')}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-y border-hairline bg-bg-subtle">
                  <th scope="col" className="px-5 py-2 text-caption font-semibold uppercase tracking-wide text-text-subtle">
                    {t('columns.order')}
                  </th>
                  <th scope="col" className="px-5 py-2 text-caption font-semibold uppercase tracking-wide text-text-subtle">
                    {t('columns.issue')}
                  </th>
                  <th scope="col" className="px-5 py-2 text-caption font-semibold uppercase tracking-wide text-text-subtle">
                    {t('columns.age')}
                  </th>
                  <th scope="col" className="px-5 py-2 text-right text-caption font-semibold uppercase tracking-wide text-text-subtle">
                    {t('columns.action')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {attention.map((order) => (
                  <tr key={order.id} className="border-b border-hairline last:border-0">
                    <td className="whitespace-nowrap px-5 py-3">
                      <Link href={`/admin/orders/${order.id}`} className="num text-small font-semibold text-brand no-underline">
                        {order.id}
                      </Link>
                      <p className="text-caption text-text-subtle">{formatMoney(order.amount, 'GHS')}</p>
                    </td>
                    <td className="px-5 py-3 text-small text-text">
                      <span className="flex items-center gap-2">
                        <CircleDot
                          className={order.status === 'held' ? 'size-4 shrink-0 text-danger' : 'size-4 shrink-0 text-warning'}
                          aria-hidden="true"
                        />
                        {order.issue}
                      </span>
                      <span className="mt-1 block text-caption text-text-subtle">{order.vehicle}</span>
                    </td>
                    <td className="num whitespace-nowrap px-5 py-3 text-small text-text-muted">{order.ageMinutes} min</td>
                    <td className="whitespace-nowrap px-5 py-3 text-right">
                      <Link href={`/admin/orders/${order.id}`} className={buttonClass('secondary', 'sm', 'min-h-9 px-3')}>
                        {t('columns.action')}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="live-title" className="panel p-5">
          <div className="flex items-center justify-between gap-2">
            <h2 id="live-title" className="text-h3 font-bold text-brand">
              {t('liveTitle')}
            </h2>
            <span className="flex items-center gap-1.5 text-caption font-semibold text-success-ink">
              <span className="relative grid size-2.5 place-items-center">
                <span className="absolute inset-0 rounded-full bg-success/30 animate-pulse-ring" aria-hidden="true" />
                <span className="size-2 rounded-full bg-success" aria-hidden="true" />
              </span>
              {t('liveNote')}
            </span>
          </div>
          <LiveFeed events={liveEvents} />
        </section>
      </div>

      <section aria-labelledby="recent-title" className="panel overflow-hidden">
        <div className="flex flex-wrap items-baseline justify-between gap-2 p-5 pb-3">
          <h2 id="recent-title" className="text-h3 font-bold text-brand">
            {t('recentTitle')}
          </h2>
          <Link href="/admin/orders" className="text-small font-semibold text-link no-underline">
            {t('viewAll')}
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-y border-hairline bg-bg-subtle">
                <th scope="col" className="px-5 py-2 text-caption font-semibold uppercase tracking-wide text-text-subtle">
                  {columns('order')}
                </th>
                <th scope="col" className="px-5 py-2 text-caption font-semibold uppercase tracking-wide text-text-subtle">
                  {columns('vehicle')}
                </th>
                <th scope="col" className="px-5 py-2 text-caption font-semibold uppercase tracking-wide text-text-subtle">
                  {columns('status')}
                </th>
                <th scope="col" className="px-5 py-2 text-right text-caption font-semibold uppercase tracking-wide text-text-subtle">
                  {columns('age')}
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 4).map((order) => (
                <tr key={order.id} className="border-b border-hairline last:border-0">
                  <td className="whitespace-nowrap px-5 py-3">
                    <Link href={`/admin/orders/${order.id}`} className="num text-small font-semibold text-brand no-underline">
                      {order.id}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-small text-text">{order.vehicle}</td>
                  <td className="px-5 py-3">
                    <StatusChip status={order.status} />
                  </td>
                  <td className="num px-5 py-3 text-right text-small text-text-muted">{order.ageMinutes} min</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
