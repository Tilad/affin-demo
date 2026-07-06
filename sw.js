// Affin PWA — полный офлайн.
// App shell предзакэширован при установке; тайлы карты, шрифты и фото кэшируются
// на лету. Стратегия stale-while-revalidate: офлайн работает из кэша,
// при живом сервере обновления тихо подтягиваются в фоне.
const VERSION = 'affin-v3';

const CORE = [
  './',
  'affin-map.html',
  'manifest.webmanifest',
  'icon-192.png', 'icon-512.png', 'apple-touch-icon.png',
  'app/vendor/react.js', 'app/vendor/react-dom.js', 'app/vendor/babel.js',
  'app/vendor/maplibre-gl.js', 'app/vendor/maplibre-gl.css',
  'app/screens/tokens.js', 'app/screens/tabbar.js', 'app/screens/geo-map.jsx',
  'app/screens/card.js', 'app/screens/map.js', 'app/screens/meet.js',
  'app/screens/result.js', 'app/screens/event.js', 'app/screens/cardpicker.js',
  'app/screens/profile.js', 'app/screens/proto.js',
  'app/avatars/marina.png', 'app/avatars/mikhail.png', 'app/avatars/self5.png',
  'app/avatars/expo-logo.png',
  ...Array.from({ length: 12 }, (_, i) => `app/avatars/p${i + 1}.png`),
];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const cache = await caches.open(VERSION);
    // по одному, чтобы один сбой не валил всю установку
    await Promise.all(CORE.map(u => cache.add(u).catch(() => null)));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key !== VERSION) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // неизменяемое (версионные тайлы, шрифты, фото) — из кэша без фоновой перезагрузки
  const immutable = url.pathname.endsWith('.pbf') || url.pathname.endsWith('.woff2')
    || url.hostname === 'i.pravatar.cc'
    || /natural_earth/.test(url.pathname);

  e.respondWith((async () => {
    const cache = await caches.open(VERSION);
    const cached = await cache.match(req, { ignoreVary: true });

    const refresh = () => fetch(req).then(res => {
      if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
      return res;
    }).catch(() => null);

    if (cached) {
      if (!immutable) e.waitUntil(refresh());  // тихое обновление в фоне
      return cached;
    }
    const res = await refresh();
    if (res) return res;
    if (req.mode === 'navigate') {
      const shell = await cache.match('affin-map.html');
      if (shell) return shell;
    }
    return Response.error();
  })());
});
