/* Public-page cache only. Authenticated pages and API traffic always use the network. */
const VERSION = 'rcc-pwa-v1';
const SHELL_CACHE = `${VERSION}-shell`;
const STATIC_CACHE = `${VERSION}-static`;
const PUBLIC_NAVIGATION = new Set(['/', '/offline']);

async function cacheDocument(cache, path) {
  const response = await fetch(path, { cache: 'reload' });
  if (!response.ok) throw new Error(`${path} unavailable`);
  const html = await response.clone().text();

  const attributes = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map((match) => match[1]);
  const srcsets = [...html.matchAll(/srcset="([^"]+)"/g)].flatMap((match) =>
    match[1].split(',').map((candidate) => candidate.trim().split(/\s+/)[0]),
  );
  const assets = [...attributes, ...srcsets]
    .map((url) => url.replaceAll('&amp;', '&'))
    .filter(
      (url) =>
        url.startsWith('/_next/static/') ||
        url.startsWith('/_next/image?') ||
        url.startsWith('/images/') ||
        ['/icon-192.png', '/icon-512.png', '/icon-512-maskable.png', '/apple-touch-icon.png'].includes(url),
    );

  await cache.put(path, response);
  await Promise.all(
    [...new Set(assets)].map(async (url) => {
      const asset = await fetch(url);
      if (asset.ok) await cache.put(url, asset);
    }),
  );
}

async function precacheShell(cache) {
  await Promise.all([cacheDocument(cache, '/'), cacheDocument(cache, '/offline')]);
  await cache.addAll(['/icon-192.png', '/icon-512.png', '/apple-touch-icon.png']);
}

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(SHELL_CACHE).then(precacheShell));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key.startsWith('rcc-pwa-') && key !== SHELL_CACHE && key !== STATIC_CACHE).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

async function handleNavigation(request) {
  const url = new URL(request.url);
  const cache = await caches.open(SHELL_CACHE);

  try {
    const response = await fetch(request);
    if (response.ok && PUBLIC_NAVIGATION.has(url.pathname)) {
      await cache.put(url.pathname, response.clone());
    }
    return response;
  } catch {
    const cached = PUBLIC_NAVIGATION.has(url.pathname)
      ? await cache.match(url.pathname)
      : await cache.match('/offline');
    return cached ?? (await cache.match('/offline')) ?? Response.error();
  }
}

async function handleStatic(request) {
  const cache = await caches.open(STATIC_CACHE);
  const shell = await caches.open(SHELL_CACHE);
  const cached = (await cache.match(request)) ?? (await shell.match(request));
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) await cache.put(request, response.clone());
    return response;
  } catch {
    return Response.error();
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith('/api/')) return;

  if (request.mode === 'navigate') {
    event.respondWith(handleNavigation(request));
    return;
  }

  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/_next/image') ||
    url.pathname.startsWith('/images/') ||
    ['/icon-192.png', '/icon-512.png', '/icon-512-maskable.png', '/apple-touch-icon.png'].includes(url.pathname)
  ) {
    event.respondWith(handleStatic(request));
  }
});
