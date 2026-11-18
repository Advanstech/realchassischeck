import createClient from 'openapi-fetch';
import type { components, paths } from './generated/api';

/** Same-origin client generated from the API-owned OpenAPI document (D-23). */
const client = createClient<paths>();

export type PreviewPayload = components['schemas']['PreviewDto'];
export type CreateLookupInput = components['schemas']['CreateLookupDto'];

export interface ApiErrorBody {
  code: string;
  message: string;
  correlationId: string;
  details?: Record<string, unknown>;
}

export class ApiRequestError extends Error {
  constructor(
    readonly status: number,
    readonly body: ApiErrorBody,
  ) {
    super(body.message);
    this.name = 'ApiRequestError';
  }
}

function sessionId(): string {
  const key = 'rcc.guest-session';
  const existing = window.sessionStorage.getItem(key);
  if (existing && /^[A-Za-z0-9_-]{8,64}$/.test(existing)) return existing;
  const created = crypto.randomUUID();
  window.sessionStorage.setItem(key, created);
  return created;
}

function requestError(response: Response, error: unknown): ApiRequestError {
  if (typeof error === 'object' && error !== null && 'code' in error && 'message' in error) {
    return new ApiRequestError(response.status, error as ApiErrorBody);
  }
  return new ApiRequestError(response.status, {
    code: response.status >= 500 ? 'SERVICE_UNAVAILABLE' : 'REQUEST_FAILED',
    message:
      response.status >= 500
        ? 'The check service is unavailable. Please try again.'
        : 'The request could not be completed. Please try again.',
    correlationId: response.headers.get('x-correlation-id') ?? 'unavailable',
  });
}

export async function createLookup(input: CreateLookupInput, signal?: AbortSignal): Promise<PreviewPayload> {
  const { data, error, response } = await client.POST('/api/v1/lookups', {
    body: input,
    headers: { 'x-rcc-session': sessionId(), 'x-correlation-id': crypto.randomUUID() },
    signal,
  });
  if (error !== undefined || !data) throw requestError(response, error);
  return data;
}

export async function getPreview(publicId: string, signal?: AbortSignal): Promise<PreviewPayload> {
  const { data, error, response } = await client.GET('/api/v1/lookups/{publicId}', {
    params: { path: { publicId } },
    headers: { 'x-correlation-id': crypto.randomUUID() },
    signal,
  });
  if (error !== undefined || !data) throw requestError(response, error);
  return data;
}

export async function createLead(
  input: components['schemas']['CreateLeadDto'],
  idempotencyKey: string,
  signal?: AbortSignal,
): Promise<components['schemas']['LeadReceiptDto']> {
  const { data, error, response } = await client.POST('/api/v1/leads', {
    params: { header: { 'Idempotency-Key': idempotencyKey } },
    headers: { 'x-correlation-id': crypto.randomUUID() },
    body: input,
    signal,
  });
  if (error !== undefined || !data) throw requestError(response, error);
  return data;
}
