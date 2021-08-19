'use strict'
const { merge } = require('webpack-merge')
const frontEndEnv = require('../../config/prod.env')

module.exports = merge(frontEndEnv, {
  OKTA: {
    AUTH_KEY: 'SSWS 00Ox5xOD2PsdeFwPEkAu6Y3G2eC7cFUMJMraVGcrfR'
  },
  STRIPE_SECRET_KEY: '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',
  CLOUDINARY: {
    CLOUD_NAME: 'train-in-blocks',
    API_KEY: '273846826416477',
    API_SECRET: 'Y1LSsFRRygnydgqN0uxd-IdV9fw'
  },
  GOOGLE_WORKSPACE: {
    USERNAME: 'joe.bailey@traininblocks.com',
    PASSWORD: 'enofaokosdxpjjqq'
  },
  ATLASSIAN: {
    USERNAME: 'joe.bailey@traininblocks.com',
    PASSWORD: 'phIZi2OJdE6VKYwXgenwF29C'
  },
  TIB_API: 'APIKEY MitsubishiLancerEvolution10CastleCombe'
})
