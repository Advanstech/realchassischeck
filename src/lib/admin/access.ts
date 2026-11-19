import type { components } from '@/lib/generated/api';

/**
 * What each role may see and do in the console. The API enforces the same list on
 * every route; this copy only decides what the UI offers, so a support agent is
 * never shown a button the server would refuse.
 */
export type StaffPermission = components['schemas']['StaffUserDto']['permissions'][number];
export type StaffRole = components['schemas']['StaffUserDto']['role'];

export function can(permissions: readonly StaffPermission[], permission: StaffPermission): boolean {
  return permissions.includes(permission);
}

export const NAV_PERMISSION = {
  overview: 'admin.read',
  orders: 'orders.read',
  transactions: 'orders.read',
  providers: 'admin.read',
  customers: 'orders.read',
  analytics: 'admin.read',
  settings: 'settings.write',
  audit: 'admin.read',
  staff: 'staff.manage',
} as const satisfies Record<string, StaffPermission>;

export type NavKey = keyof typeof NAV_PERMISSION;

export const ACTION_PERMISSION = {
  retry: 'orders.write',
  rebuild: 'orders.write',
  refund: 'refunds.write',
} as const satisfies Record<string, StaffPermission>;

export type ActionKey = keyof typeof ACTION_PERMISSION;
