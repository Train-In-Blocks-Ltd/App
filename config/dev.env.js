'use strict'
const { merge } = require('webpack-merge')
const prodEnv = require('./prod.env.js')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  STRIPE_PUBLIC_KEY: 'pk_test_JJvkMA1gokB1Ty1Wu4gY6NaF00HXUldor1'
})
