import 'server-only';
import type { components } from '@/lib/generated/api';
import { getStaffCookieHeader, type StaffAccount } from '@/lib/staff-session';
import {
  findOrder as findSampleOrder,
  orders as sampleOrders,
  providers as sampleProviders,
  switches as sampleSwitches,
  type AdminOrder,
  type ProviderHealth,
  type TimelineEvent,
} from './data';

/**
 * One seam between the console screens and their data. Screens keep the same
 * component props; this module decides whether the rows come from the ADM
 * endpoints or from the labelled sample set, so a developer never sees an empty
 * console and a staff member never sees fake numbers presented as live.
 */

type OrderList = components['schemas']['AdminOrderListDto'];
type OrderSummary = OrderList['orders'][number];
type OrderDetail = components['schemas']['AdminOrderDetailDto'];
type ProviderList = components['schemas']['AdminProviderListDto'];
type SwitchList = components['schemas']['AdminSwitchListDto'];

const ORIGIN = process.env.API_ORIGIN ?? 'http://localhost:4000';

export interface Feed<T> {
  readonly data: T;
  /** True when the API is unreachable or has no rows yet. */
  readonly sample: boolean;
}

async function read<T>(path: string): Promise<T | null> {
  const cookie = await getStaffCookieHeader();
  if (!cookie) return null;
  try {
    const response = await fetch(`${ORIGIN}/api/v1${path}`, {
      cache: 'no-store',
      headers: { cookie, accept: 'application/json' },
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

function toTimeline(entries: OrderDetail['timeline'] | undefined): ReadonlyArray<TimelineEvent> {
  return (entries ?? []).map((entry) => ({
    at: entry.at,
    label: entry.label,
    detail: entry.detail ?? undefined,
    tone: entry.tone ?? 'neutral',
  }));
}

function toOrder(order: OrderSummary, timeline?: OrderDetail['timeline']): AdminOrder {
  return {
    id: order.publicRef,
    vehicle: order.vehicle || '—',
    vin: order.vin || '—',
    // Names are not collected from guests; the contact is the phone or email on file.
    customer: order.contact || '—',
    phone: order.contact || '—',
    method: order.method || '—',
    amount: order.amountPesewas,
    status: order.state,
    ageMinutes: order.ageMinutes,
    issue: order.issue,
    providerCostUsd: order.providerCostUsd,
    createdAt: order.createdAt,
    timeline: toTimeline(timeline),
  };
}

/** Keys as the seed writes them; an unknown flag falls back to its own key. */
const SWITCH_NAME: Record<string, string> = {
  live_payments: 'Live payments',
  'payments.mobile_money': 'Mobile money',
  'payments.card': 'Card payments',
  'provider.vinaudit': 'VinAudit provider',
  'whatsapp.support_button': 'WhatsApp support button',
  japan_requests: 'Japan requests',
  referral_codes: 'Referral codes',
};

export async function loadStaff(): Promise<ReadonlyArray<StaffAccount>> {
  return (await read<ReadonlyArray<StaffAccount>>('/staff/users')) ?? [];
}

export async function loadOrders(): Promise<Feed<ReadonlyArray<AdminOrder>>> {
  const payload = await read<OrderList>('/admin/orders?limit=200');
  if (!payload || payload.orders.length === 0) return { data: sampleOrders, sample: true };
  return { data: payload.orders.map((order) => toOrder(order)), sample: false };
}

export async function loadOrder(id: string): Promise<Feed<AdminOrder | undefined>> {
  const payload = await read<OrderDetail>(`/admin/orders/${encodeURIComponent(id)}`);
  if (payload) return { data: toOrder(payload, payload.timeline), sample: false };
  const fallback = findSampleOrder(id);
  return { data: fallback, sample: Boolean(fallback) };
}

export async function loadProviders(): Promise<Feed<ReadonlyArray<ProviderHealth>>> {
  const payload = await read<ProviderList>('/admin/providers');
  if (!payload || payload.providers.length === 0) return { data: sampleProviders, sample: true };
  return {
    data: payload.providers.map((provider) => ({
      name: provider.name,
      role: provider.purpose || '—',
      latencyMs: provider.latencyMs ?? 0,
      failures: provider.failures,
      cost: provider.costUsd === null ? '—' : `USD ${provider.costUsd.toFixed(2)}`,
      state: provider.state,
    })),
    sample: false,
  };
}

export async function loadSwitches(): Promise<Feed<ReadonlyArray<{ name: string; detail: string; on: boolean }>>> {
  const payload = await read<SwitchList>('/admin/switches');
  if (!payload || payload.switches.length === 0) return { data: sampleSwitches, sample: true };
  return {
    data: payload.switches.map((flag) => ({
      name: SWITCH_NAME[flag.key] ?? flag.key.replaceAll(/[._]/g, ' '),
      detail: flag.description ?? '',
      on: flag.enabled,
    })),
    sample: false,
  };
}
