/**
 * Placeholder data for the staff console.
 *
 * The ADM endpoints do not exist yet (M4 owns them). Every screen reads from this
 * module instead of inventing numbers inline, so wiring the real API means replacing
 * these exports with server-side fetches and keeping the component props unchanged.
 */

export type OrderStatus = 'paid' | 'delivered' | 'held' | 'pending' | 'refunded' | 'failed';

export interface TimelineEvent {
  readonly at: string;
  readonly label: string;
  readonly detail?: string;
  readonly tone?: 'neutral' | 'ok' | 'warn' | 'bad';
}

export interface AdminOrder {
  readonly id: string;
  readonly vehicle: string;
  readonly vin: string;
  readonly customer: string;
  readonly phone: string;
  readonly method: string;
  /** Amount in pesewas. */
  readonly amount: number;
  readonly status: OrderStatus;
  readonly ageMinutes: number;
  readonly issue?: string;
  /** Provider cost in USD for this order. */
  readonly providerCostUsd: number;
  readonly createdAt: string;
  readonly timeline: ReadonlyArray<TimelineEvent>;
}

export const orders: ReadonlyArray<AdminOrder> = [
  {
    id: 'RC-2611-000118',
    vehicle: '2016 Toyota Corolla LE',
    vin: '1M8GDM9AXKP042788',
    customer: 'Ama Mensah',
    phone: '024 123 4567',
    method: 'MTN MoMo',
    amount: 14900,
    status: 'held',
    ageMinutes: 3,
    issue: 'Amount mismatch, order held',
    providerCostUsd: 3.5,
    createdAt: '2026-11-19T14:06:00Z',
    timeline: [
      { at: '14:06', label: 'Order created', detail: 'MTN MoMo · GH₵149.00' },
      { at: '14:06', label: 'Payment prompt sent', detail: 'Reference RCC-2611-000118' },
      { at: '14:07', label: 'Webhook received', detail: 'Signature valid, replay window clear', tone: 'ok' },
      { at: '14:07', label: 'Amount mismatch', detail: 'Gateway reported GH₵14.00, expected GH₵149.00', tone: 'bad' },
      { at: '14:07', label: 'Order held for review', detail: 'No report built, no charge captured', tone: 'warn' },
    ],
  },
  {
    id: 'RC-2611-000121',
    vehicle: '2018 Kia Sportage',
    vin: 'KNAPM81ABJK123456',
    customer: 'Kwame Boateng',
    phone: '020 555 8899',
    method: 'Card',
    amount: 14900,
    status: 'paid',
    ageMinutes: 8,
    issue: 'Provider failed, retry 2 of 3',
    providerCostUsd: 3.5,
    createdAt: '2026-11-19T14:01:00Z',
    timeline: [
      { at: '14:01', label: 'Order created', detail: 'Card · GH₵149.00' },
      { at: '14:02', label: 'Payment approved', detail: 'Server-to-server verification passed', tone: 'ok' },
      { at: '14:02', label: 'Fulfilment queued', detail: 'Job 8841' },
      { at: '14:03', label: 'Provider timeout', detail: 'Attempt 1 of 3', tone: 'warn' },
      { at: '14:05', label: 'Provider timeout', detail: 'Attempt 2 of 3, backing off', tone: 'warn' },
    ],
  },
  {
    id: 'RC-2611-000109',
    vehicle: '2014 Honda CR-V',
    vin: '2HKRM4H75EH123456',
    customer: 'Efua Owusu',
    phone: '055 010 2233',
    method: 'Telecel Cash',
    amount: 39900,
    status: 'pending',
    ageMinutes: 16,
    issue: 'Payment pending over 15 min',
    providerCostUsd: 10.5,
    createdAt: '2026-11-19T13:53:00Z',
    timeline: [
      { at: '13:53', label: 'Order created', detail: 'Telecel Cash · bundle of three' },
      { at: '13:53', label: 'Prompt sent', detail: 'Waiting for buyer approval', tone: 'warn' },
      { at: '14:08', label: 'Still pending', detail: 'Reconciliation job will close at 15 min', tone: 'warn' },
    ],
  },
  {
    id: 'RC-2611-000124',
    vehicle: '2020 Hyundai Elantra',
    vin: 'KMHD84LF8LU123456',
    customer: 'Yaw Asante',
    phone: '024 909 1122',
    method: 'AT Money',
    amount: 14900,
    status: 'delivered',
    ageMinutes: 1,
    providerCostUsd: 3.5,
    createdAt: '2026-11-19T14:08:00Z',
    timeline: [
      { at: '14:08', label: 'Order created', detail: 'AT Money · GH₵149.00' },
      { at: '14:08', label: 'Payment approved', tone: 'ok' },
      { at: '14:09', label: 'Report delivered', detail: 'PDF, SMS and email', tone: 'ok' },
    ],
  },
  {
    id: 'RC-2611-000125',
    vehicle: '2017 Nissan Rogue',
    vin: '5N1AT2MV7HC123456',
    customer: 'Sarah Tetteh',
    phone: '027 333 4455',
    method: 'MTN MoMo',
    amount: 59500,
    status: 'paid',
    ageMinutes: 2,
    providerCostUsd: 17.5,
    createdAt: '2026-11-19T14:07:00Z',
    timeline: [
      { at: '14:07', label: 'Order created', detail: 'Bundle of five · GH₵595.00' },
      { at: '14:07', label: 'Payment approved', tone: 'ok' },
      { at: '14:08', label: 'Fulfilment running', detail: 'Job 8846' },
    ],
  },
  {
    id: 'RC-2611-000107',
    vehicle: '2015 Ford Escape',
    vin: '1FMCU9J9XFUA12345',
    customer: 'Daniel Adjei',
    phone: '024 777 6655',
    method: 'Card',
    amount: 14900,
    status: 'refunded',
    ageMinutes: 42,
    issue: 'Refunded: no usable records',
    providerCostUsd: 3.5,
    createdAt: '2026-11-19T13:27:00Z',
    timeline: [
      { at: '13:27', label: 'Order created', detail: 'Card · GH₵149.00' },
      { at: '13:28', label: 'Payment approved', tone: 'ok' },
      { at: '13:33', label: 'No usable records', detail: 'Provider returned an empty set', tone: 'warn' },
      { at: '13:41', label: 'Refund issued', detail: 'Reason: no usable records', tone: 'ok' },
    ],
  },
  {
    id: 'RC-2611-000126',
    vehicle: '2019 Toyota Camry',
    vin: '4T1B11HK5KU123456',
    customer: 'Nana Yaa Addo',
    phone: '020 222 3344',
    method: 'MTN MoMo',
    amount: 14900,
    status: 'delivered',
    ageMinutes: 4,
    providerCostUsd: 3.5,
    createdAt: '2026-11-19T14:05:00Z',
    timeline: [
      { at: '14:05', label: 'Order created', detail: 'MTN MoMo · GH₵149.00' },
      { at: '14:05', label: 'Payment approved', tone: 'ok' },
      { at: '14:06', label: 'Report delivered', detail: 'Verdict: Caution', tone: 'ok' },
    ],
  },
];

export function findOrder(id: string): AdminOrder | undefined {
  return orders.find((order) => order.id === id);
}

/**
 * Placeholder FX rate until the finance module owns it (M4). Provider cost is billed
 * in USD; margin must be shown in cedis, so one rate has to live somewhere.
 */
export const USD_TO_GHS = 15.5;

/** Gross margin in pesewas: what the buyer paid minus the provider cost. */
export function marginPesewas(order: AdminOrder): number {
  return order.amount - Math.round(order.providerCostUsd * USD_TO_GHS * 100);
}

export interface Kpi {
  readonly key: 'sales' | 'paid' | 'conversion' | 'spend' | 'attention';
  readonly value: string;
  readonly deltaKey: 'sales' | 'paid' | 'conversion' | 'spend' | 'attention';
  readonly trend?: 'up' | 'down' | 'warn';
  readonly spark: ReadonlyArray<number>;
}

export const kpis: ReadonlyArray<Kpi> = [
  { key: 'sales', value: 'GH₵4,830', deltaKey: 'sales', trend: 'up', spark: [12, 18, 15, 22, 26, 24, 31, 36] },
  { key: 'paid', value: '36', deltaKey: 'paid', trend: 'up', spark: [8, 11, 9, 14, 16, 15, 19, 22] },
  { key: 'conversion', value: '4.1%', deltaKey: 'conversion', trend: 'down', spark: [18, 17, 19, 16, 15, 17, 14, 14] },
  { key: 'spend', value: 'USD 118', deltaKey: 'spend', trend: 'up', spark: [6, 9, 8, 12, 14, 13, 16, 18] },
  { key: 'attention', value: '3', deltaKey: 'attention', trend: 'warn', spark: [4, 3, 5, 2, 4, 3, 3, 3] },
];

/** Paid reports per day for the last 14 days; the final point is today. */
export const salesSeries: ReadonlyArray<{ day: string; value: number }> = [
  { day: '5', value: 26 },
  { day: '6', value: 34 },
  { day: '7', value: 31 },
  { day: '8', value: 38 },
  { day: '9', value: 44 },
  { day: '10', value: 36 },
  { day: '11', value: 41 },
  { day: '12', value: 52 },
  { day: '13', value: 49 },
  { day: '14', value: 58 },
  { day: '15', value: 54 },
  { day: '16', value: 63 },
  { day: '17', value: 47 },
  { day: '18', value: 36 },
];

export const funnel: ReadonlyArray<{ key: string; value: number }> = [
  { key: 'Visits', value: 2410 },
  { key: 'Valid VIN', value: 1320 },
  { key: 'Preview shown', value: 1010 },
  { key: 'Checkout', value: 142 },
  { key: 'Paid', value: 36 },
  { key: 'Shared', value: 9 },
];

export const liveEvents: ReadonlyArray<{ at: string; label: string; tone?: 'neutral' | 'ok' | 'warn' | 'bad' }> = [
  { at: '14:09', label: 'Report delivered RC-…123', tone: 'ok' },
  { at: '14:07', label: 'Payment approved GH₵149.00', tone: 'ok' },
  { at: '14:06', label: 'Order created · MTN MoMo' },
  { at: '14:04', label: 'Preview shown · 2016 Corolla' },
  { at: '14:02', label: 'Refund issued RC-…099', tone: 'warn' },
  { at: '13:58', label: 'Provider call failed, retried', tone: 'warn' },
  { at: '13:55', label: 'Webhook rejected · bad signature', tone: 'bad' },
];

export interface ProviderHealth {
  readonly name: string;
  readonly role: string;
  readonly latencyMs: number;
  readonly failures: number;
  readonly cost: string;
  readonly state: 'healthy' | 'degraded' | 'off';
}

export const providers: ReadonlyArray<ProviderHealth> = [
  { name: 'VinAudit', role: 'Vehicle records', latencyMs: 820, failures: 2, cost: 'USD 3.50', state: 'healthy' },
  { name: 'AdvansisPay', role: 'Payments', latencyMs: 410, failures: 0, cost: '1.8% + GH₵0.50', state: 'healthy' },
  { name: 'SES', role: 'Email delivery', latencyMs: 260, failures: 0, cost: 'USD 0.10 / 1000', state: 'healthy' },
  { name: 'SMS gateway', role: 'SMS delivery', latencyMs: 1900, failures: 6, cost: 'GH₵0.04', state: 'degraded' },
  { name: 'Japan partner', role: 'Chassis records', latencyMs: 0, failures: 0, cost: 'Not contracted', state: 'off' },
];

export const switches: ReadonlyArray<{ name: string; detail: string; on: boolean }> = [
  { name: 'Live payments', detail: 'Off until the go/no-go on 30 Nov', on: false },
  { name: 'Mobile money', detail: 'MTN, Telecel and AT through AdvansisPay', on: true },
  { name: 'Card payments', detail: 'Visa and Mastercard redirect', on: true },
  { name: 'Japan requests', detail: 'Collect interest until the partner signs', on: true },
  { name: 'Referral codes', detail: 'Phase 1B growth work', on: false },
];
