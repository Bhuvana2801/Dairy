const CACHE_NAME = 'adf-admin-v1';
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './main.js',
    './manifest.json',
    '../images/logo.png'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((res) => res || fetch(e.request))
    );
});
