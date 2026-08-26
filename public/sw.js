const CACHE_NAME = 'siloe-pwa-v1'

// Assets para cache imediato (App Shell)
const SHELL_ASSETS = [
  '/',
  '/dashboard',
  '/offline',
  '/manifest.json',
  '/apple-touch-icon.png',
  '/favicon-32x32.png',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
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

  // Ignora requisições de outros domínios (analytics, fontes externas)
  if (url.origin !== self.location.origin) return

  // Assets estáticos Next.js → Cache-first
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            const clone = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
            return response
          })
      )
    )
    return
  }

  // Imagens → Cache-first com fallback de rede
  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request)
            .then((response) => {
              const clone = response.clone()
              caches
                .open(CACHE_NAME)
                .then((cache) => cache.put(request, clone))
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
          // Salva uma cópia em cache se a requisição foi bem-sucedida
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
          return response
        })
        .catch(() =>
          caches.match(request).then(
            (cached) =>
              cached ||
              caches.match('/offline')
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
