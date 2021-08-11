'use strict'
const { merge } = require('webpack-merge')
const frontEndEnv = require('../../config/dev.env')
const prodEnv = require('./prod.env.js')

module.exports = merge(prodEnv, frontEndEnv, {})
