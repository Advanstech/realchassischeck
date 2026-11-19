import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'Real Chassis Check',
    short_name: 'RCC',
    description: 'VIN lookup · Vehicle history · Peace of mind',
    start_url: '/?source=pwa',
    scope: '/',
    display: 'standalone',
    background_color: '#FBFCFE',
    theme_color: '#081B35',
    lang: 'en',
    dir: 'ltr',
    categories: ['business', 'utilities'],
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
