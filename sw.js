// Service Worker: sw.js
// Versão com Network-First para garantir que celulares sempre carreguem a versão mais recente
const CACHE_NAME = 'jw-study-v3.2-20261024';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  './cache/todas_semanas.json',
  './cache/semana_2026_43.json',
  './cache/semana_2026_44.json',
  './cache/semana_2026_45.json'
];

self.addEventListener('install', (event) => {
  // Pula a fila de espera imediatamente para ativar a nova versão
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('Erro ao pré-armazenar assets no SW:', err);
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  // Limpa caches antigos de versões anteriores imediatamente
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('SW: Removendo cache antigo:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // Ignora requisições de API para que usem a rede sempre
  if (
    url.includes('/api/') || 
    url.includes('generativelanguage.googleapis.com') || 
    url.includes('supabase.co')
  ) {
    return;
  }

  // ESTRATÉGIA NETWORK-FIRST PARA A PÁGINA PRINCIPAL / NAVEGAÇÃO
  // Isso resolve o problema de celulares ficarem presos na versão antiga!
  const isNavigate = event.request.mode === 'navigate' || 
                     url.endsWith('/') || 
                     url.endsWith('/index.html') ||
                     (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html'));

  if (isNavigate) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Fallback offline (se estiver sem internet, usa a versão do cache)
          return caches.match(event.request).then((cached) => cached || caches.match('./index.html'));
        })
    );
    return;
  }

  // Para assets estáticos: tenta cache primeiro, mas atualiza o cache em segundo plano (Stale-While-Revalidate)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return networkResponse;
      }).catch(() => {});

      return cachedResponse || fetchPromise;
    })
  );
});
