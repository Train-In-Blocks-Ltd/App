'use strict'
const { merge } = require('webpack-merge')
const prodEnv = require('./prod.env.js')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  STRIPE: 'sk_test_0INBfg1OBTSo6LGQXspiol8a00lqVj8EFF',
})
