'use strict'
const { merge } = require('webpack-merge')
const frontEndEnv = require('../../config/prod.env')

module.exports = merge(frontEndEnv, {
  OKTA: {
    AUTH_KEY: 'SSWS 00r26hoJMP9lITIbqrR596dGTWAL0I8lFljhdxfaBV'
  },
  STRIPE: {
    SECRET_KEY: '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'
  },
  CLOUDINARY: {
    CLOUD_NAME: 'train-in-blocks',
    API_KEY: '896869656247474',
    API_SECRET: 'KLXFI8z7O2SmPD6gVlYMJ597aHQ'
  },
  GOOGLE_WORKSPACE: {
    USERNAME: 'joe.bailey@traininblocks.com',
    PASSWORD: 'fczhxioeejfvtpbi'
  },
  ATLASSIAN: {
    USERNAME: 'joe.bailey@traininblocks.com',
    PASSWORD: 'FE98Xa9rXzGV1w7Ut6YXD397'
  },
  TIB_API: 'APIKEY TrainInBlocksCalendarNetlifyFunctionAbacus'
})
