import 'server-only';
import { cookies } from 'next/headers';
import type { components } from '@/lib/generated/api';

/**
 * Staff console session (ACC-06). The API owns the identity: this module only
 * forwards the browser's cookie jar to `/staff/auth/me` and mirrors the cookies
 * the API sets after a successful sign-in. There is no local passcode and no
 * shared token, so the console is exactly as strong as the staff account.
 */

export type StaffAccount = components['schemas']['StaffUserDto'];

const API_ORIGIN = (process.env.API_ORIGIN ?? 'http://localhost:4000').replace(/\/$/, '');

/** Cookie names are deployment configuration, duplicated here because the web never imports backend code. */
export const STAFF_ACCESS_COOKIE = 'rcc_staff_at';
export const STAFF_REFRESH_COOKIE = 'rcc_staff_rt';

export function staffApiOrigin(): string {
  return API_ORIGIN;
}

/** The full browser jar, as a Cookie header for a server-side API call. */
export async function getStaffCookieHeader(): Promise<string> {
  const jar = await cookies();
  return jar
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join('; ');
}

export async function getStaffSession(): Promise<StaffAccount | null> {
  const cookie = await getStaffCookieHeader();
  if (!cookie) return null;

  try {
    const response = await fetch(`${API_ORIGIN}/api/v1/staff/auth/me`, {
      headers: { cookie, accept: 'application/json' },
      cache: 'no-store',
    });
    if (!response.ok) return null;
    return (await response.json()) as StaffAccount;
  } catch {
    return null;
  }
}

/** Mirrors the API's Set-Cookie headers into the Next.js cookie jar after login/refresh. */
export async function copyStaffCookies(response: Response): Promise<void> {
  const headers = response.headers.getSetCookie();
  if (headers.length === 0) return;

  const jar = await cookies();
  for (const header of headers) {
    const parsed = parseSetCookie(header);
    if (!parsed) continue;
    jar.set(parsed.name, parsed.value, parsed.options);
  }
}

export async function clearStaffCookies(): Promise<void> {
  const jar = await cookies();
  jar.delete(STAFF_ACCESS_COOKIE);
  jar.delete(STAFF_REFRESH_COOKIE);
}

interface SetCookieOptions {
  path?: string;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'lax' | 'strict' | 'none';
  maxAge?: number;
}

function parseSetCookie(
  header: string,
): { name: string; value: string; options: SetCookieOptions } | null {
  const [pair, ...attributes] = header.split(';');
  if (!pair) return null;

  const separator = pair.indexOf('=');
  if (separator <= 0) return null;

  const name = pair.slice(0, separator).trim();
  const value = pair.slice(separator + 1).trim();
  if (!name) return null;

  const options: SetCookieOptions = {};

  for (const attribute of attributes) {
    const [key = '', raw = ''] = attribute.split('=');
    switch (key.trim().toLowerCase()) {
      case 'path':
        options.path = raw.trim();
        break;
      case 'httponly':
        options.httpOnly = true;
        break;
      case 'secure':
        options.secure = true;
        break;
      case 'samesite': {
        const value = raw.trim().toLowerCase();
        if (value === 'lax' || value === 'strict' || value === 'none') options.sameSite = value;
        break;
      }
      case 'max-age': {
        const seconds = Number.parseInt(raw, 10);
        if (Number.isFinite(seconds)) options.maxAge = seconds;
        break;
      }
      default:
        break;
    }
  }

  return { name, value, options };
}
