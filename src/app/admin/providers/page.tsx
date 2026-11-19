import { Activity, ArrowLeft, Gauge, PlugZap } from 'lucide-react';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { SwitchList } from '@/components/admin/switch-list';
import { Chip, type Tone } from '@/components/ui/primitives';
import type { ProviderHealth } from '@/lib/admin/data';
import { loadProviders, loadSwitches } from '@/lib/admin/source';
import { can } from '@/lib/admin/access';
import { getStaffSession } from '@/lib/staff-session';
import { cn } from '@/lib/cn';

const TONE: Record<ProviderHealth['state'], Tone> = {
  healthy: 'success',
  degraded: 'warning',
  off: 'neutral',
};

const BAR: Record<ProviderHealth['state'], string> = {
  healthy: 'bg-success',
  degraded: 'bg-warning',
  off: 'bg-border-strong',
};

/** 2 s is the budget the design specification allows a lookup to take. */
const BUDGET_MS = 2000;

export default async function AdminProvidersPage() {
  const t = await getTranslations('admin.providers');
  const nav = await getTranslations('admin');
  const units = await getTranslations('admin.units');
  const providerFeed = await loadProviders();
  const switchFeed = await loadSwitches();
  const staff = await getStaffSession();
  const canEdit = can(staff?.permissions ?? [], 'settings.write');
  const providers = providerFeed.data;
  const switches = switchFeed.data;
  const sample = providerFeed.sample || switchFeed.sample;
  const unhealthy = providers.filter((provider) => provider.state !== 'healthy').length;

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-2">
        <Link
          href="/admin"
          className="inline-flex w-fit items-center gap-1.5 text-caption font-semibold text-text-muted no-underline hover:text-brand"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          {nav('nav.overview')}
        </Link>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-h1 font-extrabold text-brand">{t('title')}</h1>
            <p className="mt-1 text-small text-text-muted">{t('note')}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Chip tone={unhealthy === 0 ? 'success' : 'warning'}>
              <Activity className="size-3.5" aria-hidden="true" />
              {unhealthy === 0 ? t('state.healthy') : t('notHealthy', { count: unhealthy })}
            </Chip>
            {sample ? (
              <span title={nav('sample.note')}>
                <Chip tone="neutral">{nav('sample.label')}</Chip>
              </span>
            ) : null}
          </div>
        </div>
      </header>

      <section aria-labelledby="health-title" className="flex flex-col gap-3">
        <h2 id="health-title" className="flex items-center gap-2 text-h3 font-bold text-brand">
          <PlugZap className="size-5 text-text-subtle" aria-hidden="true" />
          {t('health')}
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {providers.map((provider) => {
            const offline = provider.state === 'off';
            return (
              <li key={provider.name} className="panel flex flex-col gap-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-body font-bold text-brand">{provider.name}</p>
                    <p className="mt-0.5 text-caption text-text-muted">{provider.role}</p>
                  </div>
                  <Chip tone={TONE[provider.state]}>{t(`state.${provider.state}`)}</Chip>
                </div>

                <dl className="grid grid-cols-3 gap-3">
                  <div>
                    <dt className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-text-subtle">
                      <Gauge className="size-3" aria-hidden="true" />
                      {t('latency')}
                    </dt>
                    <dd className="num mt-1 text-small font-semibold text-text">
                      {offline ? '—' : `${provider.latencyMs} ${units('ms')}`}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-wide text-text-subtle">{t('failures')}</dt>
                    <dd
                      className={cn(
                        'num mt-1 text-small font-semibold',
                        provider.failures > 0 ? 'text-danger-ink' : 'text-text',
                      )}
                    >
                      {provider.failures}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-semibold uppercase tracking-wide text-text-subtle">{t('cost')}</dt>
                    <dd className="mt-1 text-caption font-semibold text-text">{provider.cost}</dd>
                  </div>
                </dl>

                <div>
                  <div
                    aria-hidden="true"
                    className="h-1.5 overflow-hidden rounded-full bg-bg-subtle"
                  >
                    <span
                      className={cn('block h-full rounded-full', BAR[provider.state])}
                      style={{ width: offline ? '4%' : `${Math.min(100, Math.max(4, (provider.latencyMs / BUDGET_MS) * 100))}%` }}
                    />
                  </div>
                  <p className="num mt-1.5 text-[11px] text-text-subtle">{t('budget', { ms: BUDGET_MS })}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="switches-title" className="panel p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="switches-title" className="text-h3 font-bold text-brand">
            {t('toggles')}
          </h2>
          <p className="text-caption text-text-subtle">{t('switchesNote')}</p>
        </div>
        <div className="mt-4">
          <SwitchList items={switches} canEdit={canEdit} />
        </div>
      </section>
    </div>
  );
}
