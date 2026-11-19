'use client';

import { useTranslations } from 'next-intl';
import { Chip, type Tone } from '@/components/ui/primitives';
import type { OrderStatus } from '@/lib/admin/data';

const TONE: Record<OrderStatus, Tone> = {
  paid: 'info',
  delivered: 'success',
  held: 'danger',
  pending: 'warning',
  refunded: 'neutral',
  failed: 'danger',
};

export function StatusChip({ status }: { readonly status: OrderStatus }) {
  const t = useTranslations('admin.orders.status');
  return (
    <Chip tone={TONE[status]}>
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {t(status)}
    </Chip>
  );
}
