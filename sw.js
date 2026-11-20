/* IZAX service worker (online only)
   - Nothing is cached, so visitors always get the newest version of the site.
   - If the device is offline, a short "no connection" page is shown instead.
   - Keep this file named "sw.js" in the same folder as index.html. */

const VERSION = "izax-v3";

const OFFLINE_PAGE = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>IZAX</title>
<style>
html,body{height:100%;margin:0;background:#000;color:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Helvetica Neue",Arial,sans-serif;text-align:center}
body{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px}
h1{font:900 44px "Arial Black",Arial,sans-serif;letter-spacing:.14em;margin:0 0 18px}
p{color:#8e8e93;font-size:17px;margin:0 0 26px}
button{background:#0071e3;color:#fff;border:0;border-radius:980px;padding:12px 24px;font-size:17px}
</style></head>
<body><h1>IZAX</h1><p>You are offline. Please connect to the internet to use IZAX.</p>
<button onclick="location.reload()">Try again</button></body></html>`;

/* Activate immediately */
self.addEventListener("install", () => self.skipWaiting());

/* Delete every old cache (izax-v1, izax-v2, ...) so no outdated version is ever shown */
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Page loads always go to the network. Other requests (images, API calls) are left to the browser. */
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || req.mode !== "navigate") return;
  e.respondWith(
    fetch(req).catch(() => new Response(OFFLINE_PAGE, {
      status: 503,
      headers: { "Content-Type": "text/html; charset=utf-8" }
    }))
  );
});
