import { ArrowLeft, CircleAlert, Clock3, Phone, User } from 'lucide-react';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { StaffActions } from '@/components/admin/staff-actions';
import { StatusChip } from '@/components/admin/status-chip';
import { Banner, Chip } from '@/components/ui/primitives';
import { buttonClass } from '@/components/ui/button';
import { marginPesewas, type TimelineEvent } from '@/lib/admin/data';
import { loadOrder } from '@/lib/admin/source';
import { getStaffSession } from '@/lib/staff-session';
import { cn } from '@/lib/cn';
import { formatMoney } from '@/lib/lookup-utils';

const DOT: Record<NonNullable<TimelineEvent['tone']> | 'default', string> = {
  default: 'bg-border-strong',
  neutral: 'bg-border-strong',
  ok: 'bg-success',
  warn: 'bg-warning',
  bad: 'bg-danger',
};

function gmt(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Accra',
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: 'short',
  }).format(new Date(iso));
}

export default async function AdminOrderDetailPage({ params }: { readonly params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await getTranslations('admin.detail');
  const columns = await getTranslations('admin.orders.columns');
  const units = await getTranslations('admin.units');
  const feed = await loadOrder(id);
  const order = feed.data;
  const staff = await getStaffSession();

  if (!order) {
    return (
      <div className="panel mx-auto mt-8 flex max-w-md flex-col items-center gap-3 px-6 py-14 text-center">
        <CircleAlert className="size-7 text-warning" aria-hidden="true" />
        <h1 className="text-h3 font-bold text-brand">{t('notFound')}</h1>
        <p className="text-small text-text-muted">{t('notFoundBody')}</p>
        <Link href="/admin/orders" className={buttonClass('secondary', 'sm', 'mt-2')}>
          <ArrowLeft className="size-4" aria-hidden="true" />
          {t('back')}
        </Link>
      </div>
    );
  }

  const margin = marginPesewas(order);
  const marginPct = Math.round((margin / order.amount) * 100);
  const raised = order.status === 'held' || order.status === 'pending';
  const captured = order.status === 'paid' || order.status === 'delivered';

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-3">
        <Link
          href="/admin/orders"
          className="inline-flex w-fit items-center gap-1.5 text-caption font-semibold text-text-muted no-underline hover:text-brand"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          {t('back')}
        </Link>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <h1 className="num text-h1 font-extrabold tracking-tight text-brand">{order.id}</h1>
          <StatusChip status={order.status} />
          {feed.sample ? <Chip tone="warning">{columns('sample')}</Chip> : null}
          <span className="flex items-center gap-1.5 text-caption text-text-subtle">
            <Clock3 className="size-3.5" aria-hidden="true" />
            <span className="num">{gmt(order.createdAt)} {units('gmt')}</span>
            <span aria-hidden="true">·</span>
            <span className="num">{order.ageMinutes} {units('min')}</span>
          </span>
        </div>
        <p className="text-small text-text-muted">
          {order.vehicle} <span aria-hidden="true">·</span> {order.customer} <span aria-hidden="true">·</span> {order.method}
        </p>
      </header>

      {order.issue ? (
        <Banner tone={raised ? 'danger' : 'warning'} title={order.issue}>
          {order.status === 'held'
            ? t('issueHeld')
            : order.status === 'refunded'
              ? t('issueRefunded')
              : t('issueRetry')}
        </Banner>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.55fr)_minmax(320px,1fr)] lg:items-start">
        <div className="flex flex-col gap-4">
          <section aria-labelledby="summary-title" className="panel p-5">
            <h2 id="summary-title" className="text-h3 font-bold text-brand">
              {t('vehicle')}
            </h2>
            <dl className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <dt className="text-caption font-semibold uppercase tracking-wide text-text-subtle">{units('vin')}</dt>
                <dd className="mt-1 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-small font-semibold uppercase tracking-[0.08em] text-text">{order.vin}</span>
                  <Chip tone="neutral">{order.vin.length}/17</Chip>
                </dd>
              </div>
              <div>
                <dt className="text-caption font-semibold uppercase tracking-wide text-text-subtle">{columns('vehicle')}</dt>
                <dd className="mt-1 text-small font-medium text-text">{order.vehicle}</dd>
              </div>
              <div>
                <dt className="text-caption font-semibold uppercase tracking-wide text-text-subtle">{t('customer')}</dt>
                <dd className="mt-1 flex items-center gap-1.5 text-small font-medium text-text">
                  <User className="size-3.5 text-text-subtle" aria-hidden="true" />
                  {order.customer}
                </dd>
              </div>
              <div>
                <dt className="text-caption font-semibold uppercase tracking-wide text-text-subtle">{columns('method')}</dt>
                <dd className="mt-1">
                  <Chip tone="neutral">{order.method}</Chip>
                </dd>
              </div>
              <div>
                <dt className="text-caption font-semibold uppercase tracking-wide text-text-subtle">{t('phone')}</dt>
                <dd className="mt-1 flex items-center gap-1.5 text-small text-text">
                  <Phone className="size-3.5 text-text-subtle" aria-hidden="true" />
                  <a href={`tel:${order.phone.replace(/\s/g, '')}`} className="num no-underline hover:underline">
                    {order.phone}
                  </a>
                </dd>
              </div>
            </dl>
          </section>

          <section aria-labelledby="timeline-title" className="panel p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 id="timeline-title" className="text-h3 font-bold text-brand">
                {t('timeline')}
              </h2>
              <span className="text-caption text-text-subtle">{t('created')} {gmt(order.createdAt)}</span>
            </div>
            <ol className="relative mt-5 flex flex-col gap-0">
              <span aria-hidden="true" className="absolute bottom-3 left-[5px] top-3 w-px bg-hairline" />
              {order.timeline.map((event, index) => (
                <li key={`${event.at}-${event.label}-${index}`} className="relative flex gap-4 pb-5 pl-0 last:pb-0">
                  <span
                    aria-hidden="true"
                    className={cn('relative z-[1] mt-1.5 size-2.5 shrink-0 rounded-full ring-4 ring-[var(--surface)]', DOT[event.tone ?? 'default'])}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <p className="text-small font-semibold text-text">{event.label}</p>
                      <span className="num text-caption text-text-subtle">{event.at}</span>
                    </div>
                    {event.detail ? <p className="mt-0.5 text-caption leading-relaxed text-text-muted">{event.detail}</p> : null}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <div className="flex flex-col gap-4 lg:sticky lg:top-24">
          <section aria-labelledby="payment-title" className="panel p-5">
            <h2 id="payment-title" className="text-h3 font-bold text-brand">
              {t('payment')}
            </h2>
            <dl className="mt-4 flex flex-col divide-y divide-hairline">
              <div className="flex items-baseline justify-between gap-4 py-2.5 first:pt-0">
                <dt className="text-small text-text-muted">{t('amount')}</dt>
                <dd className="num text-body font-bold text-brand">{formatMoney(order.amount, 'GHS')}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-2.5">
                <dt className="text-small text-text-muted">{t('providerCost')}</dt>
                <dd className="num text-small font-semibold text-text">{units('usd')} {order.providerCostUsd.toFixed(2)}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-2.5 last:pb-0">
                <dt className="text-small text-text-muted">{t('gross')}</dt>
                <dd className="text-right">
                  <span className={cn('num text-small font-bold', captured ? 'text-success-ink' : 'text-text-subtle')}>
                    {captured ? formatMoney(margin, 'GHS') : '—'}
                  </span>
                  {captured ? (
                    <span className="num ml-1.5 text-caption text-text-subtle">{marginPct}%</span>
                  ) : (
                    <span className="ml-1.5 text-caption text-text-subtle">{t('notCaptured')}</span>
                  )}
                </dd>
              </div>
            </dl>
          </section>

          <section aria-labelledby="actions-title" className="panel p-5">
            <h2 id="actions-title" className="text-h3 font-bold text-brand">
              {t('actions')}
            </h2>
            <div className="mt-4">
              <StaffActions orderId={order.id} permissions={staff?.permissions ?? []} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
