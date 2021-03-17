import { BackgroundSyncPlugin } from 'workbox-background-sync'
import { registerRoute } from 'workbox-routing'
import { NetworkOnly, NetworkFirst } from 'workbox-strategies'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'
/*
import { precacheAndRoute } from 'workbox-precaching'

// Use with precache injection
precacheAndRoute(self.__WB_MANIFEST)
*/
const CACHE = 'pwabuilder-precache'

const networkFirstPaths = [/([\s\S]+)api.traininblocks.co([\s\S]+)/]

const networkOnlyPaths = [/([\s\S]+).okta.com([\s\S]+)|([\s\S]+)app.traininblocks.com\/implicit([\s\S]+)/]

const bgSyncPlugin = new BackgroundSyncPlugin('TrainInBlocks', {
  maxRetentionTime: 24 * 60 // Retry for max of 24 Hours (specified in minutes)
})

networkFirstPaths.forEach((path) => {
  registerRoute(
    new RegExp(path),
    new NetworkFirst({
      cacheName: CACHE,
      plugins: [
        bgSyncPlugin,
        new CacheableResponsePlugin({
          statuses: [200]
        })
      ]
    }),
    ['POST', 'GET', 'PUT']
  )
})

networkOnlyPaths.forEach((path) => {
  registerRoute(
    new RegExp(path),
    new NetworkOnly({
      cacheName: CACHE
    })
  )
})

registerRoute(
  /\/*/,
  new NetworkFirst({
    cacheName: CACHE,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [200]
      })
    ]
  })
)

self.addEventListener('install', function (event) {
  self.skipWaiting()
})