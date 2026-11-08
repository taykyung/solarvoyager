// Solar Voyager 서비스 워커: 한 번 접속하면 오프라인에서도 실행되도록 파일을 저장해 둡니다.
const CACHE = 'solar-voyager-v4';

const LOCAL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-512.png',
  './icons/apple-touch-icon.png',
];
// 3D 엔진(Three.js)과 글꼴은 CDN에서 받아 함께 저장
const REMOTE = [
  'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js',
  'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(LOCAL);
    // CDN 파일은 실패해도 설치를 막지 않음 (첫 실행 때 다시 저장됨)
    await Promise.all(REMOTE.map((url) => cache.add(url).catch(() => {})));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // 페이지 이동: 네트워크 우선, 안 되면 저장본
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const res = await fetch(req);
        const cache = await caches.open(CACHE);
        cache.put('./index.html', res.clone());
        return res;
      } catch {
        return (await caches.match('./index.html')) || (await caches.match('./'));
      }
    })());
    return;
  }

  // 같은 출처 파일, CDN 스크립트, 구글 글꼴: 저장본 우선, 없으면 받아서 저장
  const cacheable = url.origin === self.location.origin
    || url.hostname === 'cdn.jsdelivr.net'
    || url.hostname === 'fonts.googleapis.com'
    || url.hostname === 'fonts.gstatic.com';
  if (!cacheable) return;

  event.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) return cached;
    try {
      const res = await fetch(req);
      if (res && (res.ok || res.type === 'opaque')) {
        const cache = await caches.open(CACHE);
        cache.put(req, res.clone());
      }
      return res;
    } catch {
      return cached || Response.error();
    }
  })());
});
