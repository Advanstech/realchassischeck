import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { AdminShell } from '@/components/admin/admin-shell';
import { StaffLogin } from '@/components/admin/staff-login';
import { getStaffSession } from '@/lib/staff-session';

export const metadata: Metadata = {
  title: 'Staff console',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { readonly children: ReactNode }) {
  const staff = await getStaffSession();

  // No session, no console: the shell never mounts for an unauthenticated visitor.
  if (!staff) return <StaffLogin />;

  return <AdminShell staff={staff}>{children}</AdminShell>;
}
