// Clearance service worker: app shell offline, map tiles cached as you browse. Route data always comes from the network.
const V='clearance-v2',TILES='clearance-tiles',MAX_TILES=800;
const SHELL=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(SHELL.map(u=>c.add(u).catch(()=>{})))));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V&&k!==TILES).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
let puts=0;
async function trim(c){const ks=await c.keys();for(const k of ks.slice(0,Math.max(0,ks.length-MAX_TILES)))await c.delete(k)}
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  if(r.mode==='navigate'||u.origin===location.origin){
    e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(V).then(c=>c.put(r.mode==='navigate'?'./index.html':r,cp))}return res})
      .catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match('./index.html'))));return}
  if(/cdnjs\.cloudflare\.com|fonts\.(googleapis|gstatic)\.com/.test(u.hostname)){
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{const cp=res.clone();caches.open(V).then(c=>c.put(r,cp));return res})));return}
  if(/tile\.openstreetmap\.org|server\.arcgisonline\.com/.test(u.hostname)){
    e.respondWith(caches.open(TILES).then(c=>c.match(r).then(m=>{
      const net=fetch(r).then(res=>{if(res.ok||res.type==='opaque'){c.put(r,res.clone());if(++puts%50===0)trim(c)}return res}).catch(()=>m||Response.error());
      return m||net})));return}
});
