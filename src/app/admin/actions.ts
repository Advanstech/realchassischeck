'use server';

import { redirect } from 'next/navigation';
import {
  clearStaffCookies,
  copyStaffCookies,
  getStaffCookieHeader,
  staffApiOrigin,
} from '@/lib/staff-session';

export interface LoginState {
  readonly error: 'invalid' | 'locked' | 'suspended' | 'network' | null;
  readonly attemptsRemaining?: number;
  readonly retryAfterSeconds?: number;
}

/**
 * Staff sign-in (ACC-06). The password goes to the API, which owns Argon2id
 * verification, lockout and the session; this action only mirrors the resulting
 * HttpOnly cookies. A failed attempt is delayed so the form cannot be sprayed at
 * line speed, and the API's lockout still applies behind that delay.
 */
const FAILED_ATTEMPT_DELAY_MS = 400;

export async function signIn(_previous: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');

  if (!email || !password) {
    await delay();
    return { error: 'invalid' };
  }

  let response: Response;
  try {
    response = await fetch(`${staffApiOrigin()}/api/v1/staff/auth/login`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-correlation-id': crypto.randomUUID(),
      },
      body: JSON.stringify({ email, password }),
      cache: 'no-store',
    });
  } catch {
    return { error: 'network' };
  }

  if (!response.ok) {
    await delay();
    const body = (await response.json().catch(() => null)) as {
      code?: string;
      details?: { attemptsRemaining?: number; retryAfterSeconds?: number };
    } | null;

    if (body?.code === 'STAFF_LOCKED') {
      return { error: 'locked', retryAfterSeconds: body.details?.retryAfterSeconds ?? 900 };
    }
    if (body?.code === 'STAFF_SUSPENDED') return { error: 'suspended' };
    return { error: 'invalid', attemptsRemaining: body?.details?.attemptsRemaining };
  }

  await copyStaffCookies(response);

  // Return the visitor to the console page they asked for, never off-site.
  const requested = formData.get('next');
  const next = typeof requested === 'string' && requested.startsWith('/admin') ? requested : '/admin';
  redirect(next);
}

export async function signOut(): Promise<void> {
  const cookie = await getStaffCookieHeader();
  if (cookie) {
    await fetch(`${staffApiOrigin()}/api/v1/staff/auth/logout`, {
      method: 'POST',
      headers: { cookie, 'x-correlation-id': crypto.randomUUID() },
      cache: 'no-store',
    }).catch(() => undefined);
  }
  await clearStaffCookies();
  redirect('/');
}

async function delay(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, FAILED_ATTEMPT_DELAY_MS));
}
