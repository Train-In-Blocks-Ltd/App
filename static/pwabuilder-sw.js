const CACHE = 'pwabuilder-precache'

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js')

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

self.addEventListener("install", function (event) {
  self.skipWaiting()
})

workbox.setConfig({ debug: false })

const networkFirstPaths = [/([\s\S]+)api.traininblocks.co([\s\S]+)|([\s\S]+).okta.com([\s\S]+)/]

networkFirstPaths.forEach((path) => {
  workbox.routing.registerRoute(
    new RegExp(path),
    new workbox.strategies.NetworkFirst({
      cacheName: CACHE
    })
  )
})

workbox.routing.registerRoute(
  new RegExp('/*'),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: CACHE
  })
);
