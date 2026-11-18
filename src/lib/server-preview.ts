import type { components } from './generated/api';

type PreviewPayload = components['schemas']['PreviewDto'];
const PUBLIC_ID = /^RCC-[0-9A-HJKMNP-TV-Z]{8}$/;

/** Server prefetch puts the public preview in the first HTML response; errors replay on the client. */
export async function getServerPreview(publicId: string): Promise<PreviewPayload | undefined> {
  if (!PUBLIC_ID.test(publicId)) return undefined;
  const apiOrigin = (process.env.API_ORIGIN ?? 'http://localhost:4000').replace(/\/$/, '');
  try {
    const response = await fetch(`${apiOrigin}/api/v1/lookups/${publicId}`, {
      cache: 'no-store',
      headers: { 'x-correlation-id': crypto.randomUUID() },
    });
    if (!response.ok) return undefined;
    return await response.json() as PreviewPayload;
  } catch {
    return undefined;
  }
}
