'use server';

import { revalidatePath } from 'next/cache';
import { getStaffCookieHeader, staffApiOrigin } from '@/lib/staff-session';

export interface StaffFormState {
  readonly error: 'taken' | 'invalid' | 'forbidden' | 'network' | null;
  readonly ok: boolean;
  /** Bumped on success so the create form remounts empty. */
  readonly seq: number;
}

export const INITIAL_STAFF_STATE: StaffFormState = { error: null, ok: false, seq: 0 };

function failure(status: number, code: unknown): StaffFormState['error'] {
  if (code === 'STAFF_EMAIL_TAKEN') return 'taken';
  if (status === 400) return 'invalid';
  if (status === 401 || status === 403) return 'forbidden';
  return 'network';
}

async function call(path: string, method: 'POST' | 'PATCH', body: Record<string, unknown>) {
  const cookie = await getStaffCookieHeader();
  return fetch(`${staffApiOrigin()}/api/v1${path}`, {
    method,
    cache: 'no-store',
    headers: {
      cookie,
      accept: 'application/json',
      'content-type': 'application/json',
      'x-correlation-id': crypto.randomUUID(),
    },
    body: JSON.stringify(body),
  });
}

export async function createStaff(_previous: StaffFormState, formData: FormData): Promise<StaffFormState> {
  const input = {
    email: String(formData.get('email') ?? '').trim(),
    name: String(formData.get('name') ?? '').trim(),
    role: String(formData.get('role') ?? ''),
    password: String(formData.get('password') ?? ''),
  };

  try {
    const response = await call('/staff/users', 'POST', input);
    if (response.status === 201) {
      revalidatePath('/admin/staff');
      return { error: null, ok: true, seq: _previous.seq + 1 };
    }
    const body = (await response.json().catch(() => null)) as { code?: string } | null;
    return { error: failure(response.status, body?.code), ok: false, seq: _previous.seq };
  } catch {
    return { error: 'network', ok: false, seq: _previous.seq };
  }
}

export async function updateStaff(
  id: string,
  _previous: StaffFormState,
  formData: FormData,
): Promise<StaffFormState> {
  const input = {
    role: String(formData.get('role') ?? ''),
    status: String(formData.get('status') ?? ''),
  };

  try {
    const response = await call(`/staff/users/${encodeURIComponent(id)}`, 'PATCH', input);
    if (response.ok) {
      revalidatePath('/admin/staff');
      return { error: null, ok: true, seq: _previous.seq + 1 };
    }
    const body = (await response.json().catch(() => null)) as { code?: string } | null;
    return { error: failure(response.status, body?.code), ok: false, seq: _previous.seq };
  } catch {
    return { error: 'network', ok: false, seq: _previous.seq };
  }
}
