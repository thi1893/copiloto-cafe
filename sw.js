/* Service worker: guarda o app inteiro no aparelho para funcionar sem internet.
   Responde do cache na hora e, quando há rede, busca a versão nova em segundo plano;
   ela passa a valer na próxima abertura. A cada publicação, mude o nome em CACHE (o app
   então baixa todos os arquivos de uma vez); ao criar ou remover arquivos, atualize FILES. */
const CACHE = 'copiloto-cafe-c301f9c0';
const FILES = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "css/app.css",
  "js/app.js",
  "js/data.js",
  "js/drinks.js",
  "js/engine.js",
  "js/feedback.js",
  "js/icons.js",
  "js/recipe.js",
  "js/scenes.js",
  "js/store.js",
  "js/ui.js",
  "js/util.js",
  "js/views/brew.js",
  "js/views/chrome.js",
  "js/views/done.js",
  "js/views/drinks.js",
  "js/views/history.js",
  "js/views/home.js",
  "js/views/method.js",
  "js/views/onboard.js",
  "js/views/prep.js",
  "js/views/sheets.js",
  "icons/grao-180.png",
  "icons/grao-192.png",
  "icons/grao-512.png",
  "icons/grao-maskable-512.png",
  "icons/logo.svg"
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, { cache: 'reload' })))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const key = req.mode === 'navigate' ? './' : req;
    const cached = await cache.match(key, { ignoreSearch: true });
    const fresh = fetch(req, { cache: 'no-cache' })
      .then(res => { if (res.ok) cache.put(key, res.clone()); return res; })
      .catch(() => null);
    if (cached) { e.waitUntil(fresh); return cached; }
    return (await fresh) || new Response('Sem conexão', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  })());
});
