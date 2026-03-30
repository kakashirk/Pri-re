/* ═══════════════════════════════════════════════
   SALATI — Service Worker
   Enables background notifications + PWA caching
   ═══════════════════════════════════════════════ */

const CACHE_NAME = 'salati-v3';
const ASSETS = ['/', '/index.html', '/style.css', '/app.js', '/manifest.json'];

// ── Install: cache static assets ──────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// ── Activate: clean old caches ────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ── Fetch: serve from cache with network fallback ──
self.addEventListener('fetch', event => {
  // Only cache same-origin requests
  if (!event.request.url.startsWith(self.location.origin)) return;
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});

// ── Message: check & fire prayer notifications ──
// Main thread sends prayer times via postMessage
self.addEventListener('message', event => {
  if (event.data?.type === 'SCHEDULE_PRAYERS') {
    const { prayers } = event.data; // [{ name, nameAr, icon, timeISO }]
    // Store in SW memory for periodic check
    self.scheduledPrayers = prayers;
  }
});

// ── Periodic sync (Chrome PWA) ────────────────
self.addEventListener('periodicsync', event => {
  if (event.tag === 'check-prayers') {
    event.waitUntil(checkAndNotify());
  }
});

async function checkAndNotify() {
  if (!self.scheduledPrayers) return;
  const now = new Date();
  for (const p of self.scheduledPrayers) {
    const pTime = new Date(p.timeISO);
    const diffMs = Math.abs(now - pTime);
    if (diffMs < 90000) { // within 90 seconds
      const alreadyNotified = await getNotified(p.name + pTime.toDateString());
      if (!alreadyNotified) {
        await setNotified(p.name + pTime.toDateString());
        await self.registration.showNotification(`${p.icon} Heure de la prière — ${p.name}`, {
          body: `${p.nameAr} — Il est l'heure. Que votre prière soit agréée.`,
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          tag: `prayer-${p.name}`,
          renotify: false,
          data: { prayer: p.name },
        });
      }
    }
  }
}

// Simple in-memory notified set (resets on SW restart)
const _notifiedSet = new Set();
function getNotified(key) { return Promise.resolve(_notifiedSet.has(key)); }
function setNotified(key) { _notifiedSet.add(key); return Promise.resolve(); }

// ── Notification click ────────────────────────
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
      if (clients.length > 0) {
        clients[0].focus();
      } else {
        self.clients.openWindow('/');
      }
    })
  );
});
