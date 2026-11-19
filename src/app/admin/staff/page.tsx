import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { StaffManager } from '@/components/admin/staff-manager';
import { can } from '@/lib/admin/access';
import { loadStaff } from '@/lib/admin/source';
import { getStaffSession } from '@/lib/staff-session';

/** Staff management is super-admin only; other roles get the ordinary 404, not a hint that it exists. */
export default async function AdminStaffPage() {
  const staff = await getStaffSession();
  if (!staff || !can(staff.permissions, 'staff.manage')) notFound();

  const t = await getTranslations('admin.staff');
  const members = await loadStaff();

  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-2">
        <h1 className="text-h1 font-extrabold text-brand">{t('title')}</h1>
        <p className="text-small text-text-muted">{t('note')}</p>
      </header>
      <StaffManager staff={members} selfId={staff.id} />
    </div>
  );
}
