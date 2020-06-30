const CACHE = 'pwabuilder-precache'
/*
const QUEUE_NAME = 'bgSyncQueue'
*/

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js')

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

self.addEventListener('install', function (event) {
  self.skipWaiting()
})

workbox.setConfig({ debug: false })
/*
const bgSyncPlugin = new workbox.backgroundSync.Plugin(QUEUE_NAME, {
  maxRetentionTime: 60 // Retry for max of 1 Hours (specified in minutes)
})
console.log(workbox)

*/
const networkFirstPaths = [/([\s\S]+)api.traininblocks.co([\s\S]+)/]

const networkOnlyPaths = [/([\s\S]+).okta.com([\s\S]+)|([\s\S]+)app.traininblocks.com\/implicit([\s\S]+)/]

networkFirstPaths.forEach((path) => {
  workbox.routing.registerRoute(
    new RegExp(path),
    new workbox.strategies.NetworkFirst({
      cacheName: CACHE,
      /*
      plugins: [
        bgSyncPlugin
      ]
      */
    })
  )
})

networkOnlyPaths.forEach((path) => {
  workbox.routing.registerRoute(
    new RegExp(path),
    new workbox.strategies.NetworkOnly({
      cacheName: CACHE,
      /*
      plugins: [
        bgSyncPlugin
      ]
      */
    })
  )
})

workbox.routing.registerRoute(
  new RegExp('/*'),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: CACHE
  })
)
