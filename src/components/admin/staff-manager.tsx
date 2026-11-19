'use client';

import { UserPlus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useActionState } from 'react';
import {
  createStaff,
  INITIAL_STAFF_STATE,
  updateStaff,
  type StaffFormState,
} from '@/app/admin/staff/actions';
import { Button } from '@/components/ui/button';
import { Banner, Chip } from '@/components/ui/primitives';
import type { StaffRole } from '@/lib/admin/access';
import type { StaffAccount } from '@/lib/staff-session';

const ROLES: ReadonlyArray<StaffRole> = ['SUPER_ADMIN', 'OPERATIONS', 'FINANCE', 'SUPPORT'];

const ROLE_KEY: Record<StaffRole, 'roleSuperAdmin' | 'roleOperations' | 'roleFinance' | 'roleSupport'> = {
  SUPER_ADMIN: 'roleSuperAdmin',
  OPERATIONS: 'roleOperations',
  FINANCE: 'roleFinance',
  SUPPORT: 'roleSupport',
};

const FIELD =
  'h-11 w-full rounded-md border border-border-strong bg-surface px-3 text-small text-text hover:border-brand/40 focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/10';

type Translate = ReturnType<typeof useTranslations>;

function errorText(t: Translate, error: StaffFormState['error']): string | null {
  switch (error) {
    case 'taken':
      return t('errorTaken');
    case 'invalid':
      return t('errorInvalid');
    case 'forbidden':
      return t('errorForbidden');
    case 'network':
      return t('errorNetwork');
    default:
      return null;
  }
}

/** Super-admin only (the page itself refuses other roles): create staff and change role or status. */
export function StaffManager({
  staff,
  selfId,
}: {
  readonly staff: ReadonlyArray<StaffAccount>;
  readonly selfId: string;
}) {
  const t = useTranslations('admin.staff');
  const roles = useTranslations('admin');
  const [state, action, pending] = useActionState(createStaff, INITIAL_STAFF_STATE);
  const createError = errorText(t, state.error);

  return (
    <div className="flex flex-col gap-5">
      <section aria-labelledby="create-staff-title" className="panel p-5">
        <h2 id="create-staff-title" className="flex items-center gap-2 text-h3 font-bold text-brand">
          <UserPlus className="size-5 text-text-subtle" aria-hidden="true" />
          {t('create')}
        </h2>
        <form key={state.seq} action={action} className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="staff-name" className="text-caption font-semibold uppercase tracking-wide text-text-subtle">
              {t('name')}
            </label>
            <input id="staff-name" name="name" required minLength={2} maxLength={80} autoComplete="off" className={FIELD} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="staff-email" className="text-caption font-semibold uppercase tracking-wide text-text-subtle">
              {t('email')}
            </label>
            <input id="staff-email" name="email" type="email" required autoComplete="off" className={FIELD} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="staff-role" className="text-caption font-semibold uppercase tracking-wide text-text-subtle">
              {t('role')}
            </label>
            <select id="staff-role" name="role" defaultValue="SUPPORT" className={FIELD}>
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {roles(ROLE_KEY[role])}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="staff-password" className="text-caption font-semibold uppercase tracking-wide text-text-subtle">
              {t('password')}
            </label>
            <input
              id="staff-password"
              name="password"
              type="password"
              required
              minLength={12}
              maxLength={256}
              autoComplete="new-password"
              aria-describedby="staff-password-hint"
              className={FIELD}
            />
            <p id="staff-password-hint" className="text-caption text-text-subtle">
              {t('passwordHint')}
            </p>
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" loading={pending}>
              {pending ? t('submitting') : t('submit')}
            </Button>
          </div>
        </form>
        {createError ? (
          <div className="mt-4">
            <Banner tone="warning" title={createError} />
          </div>
        ) : null}
        {state.ok ? (
          <div className="mt-4">
            <Banner tone="info" title={t('created')} />
          </div>
        ) : null}
      </section>

      <section aria-labelledby="staff-list-title" className="panel p-5">
        <h2 id="staff-list-title" className="text-h3 font-bold text-brand">
          {t('title')}
        </h2>
        {staff.length === 0 ? (
          <p className="mt-4 text-small text-text-muted">{t('empty')}</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="border-b border-hairline text-caption font-semibold uppercase tracking-wide text-text-subtle">
                  <th scope="col" className="py-2 pr-4">{t('columns.name')}</th>
                  <th scope="col" className="py-2 pr-4">{t('columns.role')}</th>
                  <th scope="col" className="py-2 pr-4">{t('columns.status')}</th>
                  <th scope="col" className="py-2">{t('columns.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {staff.map((member) => (
                  <StaffRow key={member.id} member={member} self={member.id === selfId} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function StaffRow({ member, self }: { readonly member: StaffAccount; readonly self: boolean }) {
  const t = useTranslations('admin.staff');
  const roles = useTranslations('admin');
  const [state, action, pending] = useActionState(
    (previous: StaffFormState, formData: FormData) => updateStaff(member.id, previous, formData),
    INITIAL_STAFF_STATE,
  );
  const error = errorText(t, state.error);

  return (
    <tr className="align-top">
      <td className="py-3 pr-4">
        <p className="text-small font-semibold text-text">{member.name ?? member.email}</p>
        <p className="text-caption text-text-muted">{member.email}</p>
      </td>
      <td className="py-3 pr-4">
        <Chip tone={member.role === 'SUPER_ADMIN' ? 'info' : 'neutral'}>{roles(ROLE_KEY[member.role])}</Chip>
      </td>
      <td className="py-3 pr-4">
        <Chip tone={member.status === 'ACTIVE' ? 'success' : 'warning'}>{t(`status.${member.status}`)}</Chip>
      </td>
      <td className="py-3">
        {self ? (
          <span className="text-caption font-semibold uppercase tracking-wide text-text-subtle">{t('you')}</span>
        ) : (
          <form action={action} className="flex flex-wrap items-center gap-2">
            <label className="sr-only" htmlFor={`role-${member.id}`}>
              {t('role')}
            </label>
            <select id={`role-${member.id}`} name="role" defaultValue={member.role} className={`${FIELD} h-10 w-auto`}>
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {roles(ROLE_KEY[role])}
                </option>
              ))}
            </select>
            <label className="sr-only" htmlFor={`status-${member.id}`}>
              {t('columns.status')}
            </label>
            <select id={`status-${member.id}`} name="status" defaultValue={member.status} className={`${FIELD} h-10 w-auto`}>
              <option value="ACTIVE">{t('status.ACTIVE')}</option>
              <option value="SUSPENDED">{t('status.SUSPENDED')}</option>
            </select>
            <Button type="submit" variant="secondary" size="sm" loading={pending}>
              {pending ? t('saving') : t('save')}
            </Button>
            {state.ok ? <Chip tone="success">{t('saved')}</Chip> : null}
            {error ? <span className="w-full text-caption text-danger-ink">{error}</span> : null}
          </form>
        )}
      </td>
    </tr>
  );
}
