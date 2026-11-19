import createClient from 'openapi-fetch';
import { requestError } from './api';
import type { components, paths } from './generated/api';

/**
 * Buyer auth client (ACC-01…ACC-06). Tokens are HttpOnly cookies set by the API;
 * this module never sees or stores them. Every call is same-origin through the
 * `/api/v1` rewrite, so SameSite=Lax is the CSRF defence.
 */
const client = createClient<paths>();

/**
 * Readable presence flag set by the API alongside the HttpOnly session cookies
 * (SESSION_HINT_COOKIE in packages/contracts). It carries no secret; it only
 * tells the web whether probing `/auth/me` is worth a request.
 */
export const SESSION_HINT_COOKIE = 'rcc_session';

export function hasSessionHint(): boolean {
  return document.cookie.split('; ').some((entry) => entry === `${SESSION_HINT_COOKIE}=1`);
}

export type AuthAccount = components['schemas']['AccountProfileDto'];
export type AuthSession = components['schemas']['AuthSessionDto'];
export type AccountUpdateInput = components['schemas']['AccountUpdateDto'];
export type OtpChallenge = components['schemas']['OtpRequestResponseDto'];
export type OtpRequestInput = components['schemas']['OtpRequestDto'];
export type OtpVerifyInput = components['schemas']['OtpVerifyDto'];

function correlation(): Record<string, string> {
  return { 'x-correlation-id': crypto.randomUUID() };
}

export async function requestOtp(input: OtpRequestInput, signal?: AbortSignal): Promise<OtpChallenge> {
  const { data, error, response } = await client.POST('/api/v1/auth/otp/request', {
    body: input,
    headers: correlation(),
    signal,
  });
  if (error !== undefined || !data) throw requestError(response, error);
  return data;
}

export async function verifyOtp(input: OtpVerifyInput, signal?: AbortSignal): Promise<AuthSession> {
  const { data, error, response } = await client.POST('/api/v1/auth/otp/verify', {
    body: input,
    headers: correlation(),
    signal,
  });
  if (error !== undefined || !data) throw requestError(response, error);
  return data;
}

/** Completes or edits the buyer profile (ACC-05 onboarding). */
export async function updateProfile(
  input: AccountUpdateInput,
  signal?: AbortSignal,
): Promise<AuthAccount> {
  const { data, error, response } = await client.PATCH('/api/v1/auth/me', {
    body: input,
    headers: correlation(),
    signal,
  });
  if (error !== undefined || !data) throw requestError(response, error);
  return data;
}

export async function fetchMe(signal?: AbortSignal): Promise<AuthAccount> {
  const { data, error, response } = await client.GET('/api/v1/auth/me', {
    headers: correlation(),
    signal,
  });
  if (error !== undefined || !data) throw requestError(response, error);
  return data;
}

/** Rotates the refresh token; the API clears the cookies when the family is dead. */
export async function refreshSession(signal?: AbortSignal): Promise<AuthSession> {
  const { data, error, response } = await client.POST('/api/v1/auth/refresh', {
    headers: correlation(),
    signal,
  });
  if (error !== undefined || !data) throw requestError(response, error);
  return data;
}

export async function signOut(): Promise<void> {
  const { error, response } = await client.POST('/api/v1/auth/logout', { headers: correlation() });
  if (error !== undefined) throw requestError(response, error);
}

export async function signOutAll(): Promise<void> {
  const { error, response } = await client.POST('/api/v1/auth/logout-all', { headers: correlation() });
  if (error !== undefined) throw requestError(response, error);
}

/** Only internal paths are honoured after sign-in, never an off-site redirect. */
export function safeNextPath(value: string | undefined, fallback = '/'): string {
  return value && value.startsWith('/') && !value.startsWith('//') ? value : fallback;
}
