// Bump VERSION whenever any cached file changes so the device fetches fresh copies.
// Caches are namespaced with PREFIX so this app never clears another app's cache
// on the shared github.io origin.
const PREFIX = 'blitz-aural-y7-';
const VERSION = PREFIX + "v2";
const ASSETS = [
  './',
  './index.html',
  './glyphs.js',
  './audio.js',
  './samples.js',
  './engrave.js',
  './content.js',
  './refs.js',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png',
  './samples/flute_C5.mp3','./samples/flute_E5.mp3',
  './samples/clarinet_D4.mp3','./samples/clarinet_As4.mp3',
  './samples/saxophone_C4.mp3','./samples/saxophone_G4.mp3',
  './samples/trumpet_C4.mp3','./samples/trumpet_G4.mp3',
  './samples/trombone_C3.mp3','./samples/trombone_F3.mp3',
  './samples/violin_A4.mp3','./samples/violin_E5.mp3',
  './samples/cello_C3.mp3','./samples/cello_G3.mp3',
  './samples/guitar_E3.mp3','./samples/guitar_B3.mp3',
  './samples/piano_C2.mp3','./samples/piano_Ds2.mp3','./samples/piano_Fs2.mp3','./samples/piano_A2.mp3',
  './samples/piano_C3.mp3','./samples/piano_Ds3.mp3','./samples/piano_Fs3.mp3','./samples/piano_A3.mp3',
  './samples/piano_C4.mp3','./samples/piano_Ds4.mp3','./samples/piano_Fs4.mp3','./samples/piano_A4.mp3',
  './samples/piano_C5.mp3','./samples/piano_Ds5.mp3','./samples/piano_Fs5.mp3','./samples/piano_A5.mp3',
  './samples/piano_C6.mp3',
  './samples/xylophone_C6.mp3','./samples/xylophone_G5.mp3'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks =>
    Promise.all(ks.filter(k => k.startsWith(PREFIX) && k !== VERSION).map(k => caches.delete(k)))
  ).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(r => r || fetch(e.request)));
});
