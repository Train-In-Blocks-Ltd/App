const CACHE = 'pwabuilder-precache'

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js')

workbox.setConfig({ debug: false })

const networkFirstPaths = [/([\s\S]+)api.traininblocks.co([\s\S]+)/]

const networkOnlyPaths = [/([\s\S]+).okta.com([\s\S]+)|([\s\S]+)app.traininblocks.com\/implicit([\s\S]+)/]

networkFirstPaths.forEach((path) => {
  workbox.routing.registerRoute(
    new RegExp(path),
    new workbox.strategies.NetworkFirst({
      cacheName: CACHE
    })
  )
})

networkOnlyPaths.forEach((path) => {
  workbox.routing.registerRoute(
    new RegExp(path),
    new workbox.strategies.NetworkOnly({
      cacheName: CACHE
    })
  )
})

workbox.routing.registerRoute(
  new RegExp('/*'),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: CACHE
  })
)

self.addEventListener('install', function (event) {
  self.skipWaiting()
})
