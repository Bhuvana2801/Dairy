const CACHE_NAME = 'ayyappa-dairy-v1';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './main.js',
  './manifest.json',
  './app_icon_1776943971406.png',
  './images/logo.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
