const C='branco-stats-v12';
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(['/','/index.html','/manifest.webmanifest','/icon.svg']))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==C).map(k=>caches.delete(k))))));
self.addEventListener('fetch',e=>{
  if(e.request.url.includes('/.netlify/functions/')) return;
  e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));
});