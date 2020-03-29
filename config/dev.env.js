'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env.js')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  CLIENT_ID: '"0oa3xeljtDMSTwJ3h4x6"',
  ISSUER: '"https://dev-183252.okta.com"',
  URL: '"http://localhost:8080"'
})
