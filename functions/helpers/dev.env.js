'use strict'
const { merge } = require('webpack-merge')
const frontEndEnv = require('../../config/dev.env')
const prodEnv = require('./prod.env.js')

module.exports = merge(prodEnv, frontEndEnv, {
  /*  STRIPE_SECRET_KEY: 'sk_test_0INBfg1OBTSo6LGQXspiol8a00lqVj8EFF' */
})
