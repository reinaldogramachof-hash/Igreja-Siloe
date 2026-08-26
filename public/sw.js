const CACHE_NAME = 'siloe-pwa-v2'

// Assets para cache imediato (App Shell essencial)
const SHELL_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/apple-touch-icon.png',
  '/favicon-32x32.png',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/logo.svg',
]

// ─── Install: pré-cache do Shell ───────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS))
  )
  // Ativa imediatamente sem esperar outras tabs fecharem
  self.skipWaiting()
})

// ─── Activate: limpa caches antigos ────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  )
  // Assume controle das tabs abertas imediatamente
  self.clients.claim()
})

// ─── Fetch: estratégia por tipo de recurso ─────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Ignora requisições não-HTTP (chrome-extension, etc.)
  if (!url.protocol.startsWith('http')) return

  // Ignora requisições de outros domínios
  if (url.origin !== self.location.origin) return

  // Ignora requisições de HMR / Webpack / Turbopack em desenvolvimento
  if (
    url.pathname.includes('/_next/webpack-hmr') ||
    url.pathname.includes('hot-update')
  ) {
    return
  }

  // Em localhost/desenvolvimento, não faz cache de chunks Next.js para evitar conflitos de Turbopack
  const isLocalhost =
    self.location.hostname === 'localhost' ||
    self.location.hostname === '127.0.0.1'

  if (isLocalhost && url.pathname.startsWith('/_next/')) {
    return
  }

  // Chunks e scripts do Next.js → Network-First com fallback de cache
  if (url.pathname.startsWith('/_next/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
          }
          return response
        })
        .catch(() => caches.match(request))
    )
    return
  }

  // Imagens estáticas → Cache-first com fallback de rede
  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request)
            .then((response) => {
              if (response && response.status === 200) {
                const clone = response.clone()
                caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
              }
              return response
            })
            .catch(() => caches.match('/icons/icon-192x192.png'))
      )
    )
    return
  }

  // Navegação (páginas HTML) → Network-first com fallback offline
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
          }
          return response
        })
        .catch(() =>
          caches.match(request).then(
            (cached) => cached || caches.match('/offline')
          )
        )
    )
    return
  }

  // Demais requests → Network com fallback para cache
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  )
})
