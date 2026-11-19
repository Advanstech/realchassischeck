'use client';

import { RotateCcw, Undo2, Wrench, type LucideIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Banner } from '@/components/ui/primitives';
import { Button } from '@/components/ui/button';
import { ACTION_PERMISSION, can, type ActionKey, type StaffPermission } from '@/lib/admin/access';
import { cn } from '@/lib/cn';

const ACTIONS: ReadonlyArray<{ key: ActionKey; icon: LucideIcon; destructive?: boolean }> = [
  { key: 'retry', icon: RotateCcw },
  { key: 'rebuild', icon: Wrench },
  { key: 'refund', icon: Undo2, destructive: true },
];

/**
 * A destructive action can never be two clicks away: choose, state a reason, then
 * submit. The reason is what the audit log shows. Until the admin API lands, submit
 * says plainly that nothing happened instead of pretending success. Only the
 * actions the signed-in role may perform are offered at all.
 */
export function StaffActions({
  orderId,
  permissions,
}: {
  readonly orderId: string;
  readonly permissions: readonly StaffPermission[];
}) {
  const t = useTranslations('admin.detail');
  const [action, setAction] = useState<ActionKey | null>(null);
  const [reason, setReason] = useState('');
  const [sent, setSent] = useState(false);
  const ready = action !== null && reason.trim().length >= 8;
  const allowed = ACTIONS.filter(({ key }) => can(permissions, ACTION_PERMISSION[key]));

  if (allowed.length === 0) {
    return <p className="text-small leading-relaxed text-text-muted">{t('actionsReadOnly')}</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 text-caption font-semibold uppercase tracking-wide text-text-subtle">{t('selectAction')}</legend>
        {allowed.map(({ key, icon: Icon, destructive }) => {
          const selected = action === key;
          return (
            <label
              key={key}
              className={cn(
                'flex min-h-11 cursor-pointer items-center gap-2.5 rounded-md border px-3 text-small font-medium transition-colors duration-150',
                selected
                  ? destructive
                    ? 'border-danger bg-danger-bg text-danger-ink'
                    : 'border-brand bg-bg-subtle text-brand'
                  : 'border-hairline bg-surface text-text-muted hover:border-border-strong hover:text-brand',
              )}
            >
              <input
                type="radio"
                name={`action-${orderId}`}
                value={key}
                checked={selected}
                onChange={() => {
                  setAction(key);
                  setSent(false);
                }}
                className="size-4 accent-[var(--color-red-600)]"
              />
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              {t(key)}
            </label>
          );
        })}
      </fieldset>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`reason-${orderId}`} className="text-caption font-semibold uppercase tracking-wide text-text-subtle">
          {t('reasonLabel')}
        </label>
        <textarea
          id={`reason-${orderId}`}
          rows={3}
          value={reason}
          onChange={(event) => {
            setReason(event.target.value);
            setSent(false);
          }}
          placeholder={t('reasonPlaceholder')}
          className="resize-y rounded-md border border-hairline bg-bg-subtle px-3 py-2 text-small text-text placeholder:text-text-subtle focus:border-brand/40 focus:bg-surface focus:outline-none focus:ring-4 focus:ring-brand/10"
        />
      </div>

      <Button
        variant="secondary"
        size="md"
        disabled={!ready}
        onClick={() => setSent(true)}
        aria-describedby={`reason-note-${orderId}`}
      >
        {t('submit')}
      </Button>
      <p id={`reason-note-${orderId}`} className="text-caption leading-relaxed text-text-subtle">
        {t('reasonNote')}
      </p>

      {sent ? <Banner tone="warning" title={t('notWired')}>{t('notWiredBody')}</Banner> : null}
    </div>
  );
}
