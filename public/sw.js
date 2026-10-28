// public/sw.js
const CACHE_NAME = 'velo-aws-v1';
const ASSETS = [
  './',
  './index.html',
  './css/styles.css',
  './js/app.js',
  './js/calculator.js',
  './js/ui.js',
  './js/storage.js',
  './js/shortcuts.js',
  './js/i18n.js',
  './js/currency.js',
  './js/db.js',
  './data/services.json',
  './data/prices.json',
  './data/regions.json',
  './data/rates.json',
  './data/translations.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});