const qs = require('querystring')
const cloudinary = require('cloudinary').v2
const axios = require('axios')
const CUSTOM_ENV = process.env.NODE_ENV === 'production' ? require('../config/prod.env') : require('../config/dev.env')
const headers = require('./helpers/headers')
cloudinary.config({
  cloud_name: CUSTOM_ENV.CLOUDINARY.CLOUD_NAME,
  api_key: CUSTOM_ENV.CLOUDINARY.API_KEY,
  api_secret: CUSTOM_ENV.CLOUDINARY.API_SECRET
})

let response

exports.handler = async function handler (event, context, callback) {
  const accessToken = event.headers.authorization.split(' ')
  response = await axios.post(`https://dev-183252.okta.com/oauth2/default/v1/introspect?client_id=${CUSTOM_ENV.OKTA.CLIENT_ID}`,
    qs.stringify({
      token: accessToken[1],
      token_type_hint: 'access_token'
    }),
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  )
  if (event.httpMethod === 'OPTIONS') {
    return callback(null, {
      statusCode: 200,
      headers,
      body: ''
    })
  } else if (event.body && response.data.active === true) {
    try {
      const { file } = await JSON.parse(event.body)
      const res = await cloudinary.uploader.upload(file, { ...JSON.parse(event.body) })
      return {
        statusCode: 200,
        body: JSON.stringify(res)
      }
    } catch (e) {
      return callback(null, {
        statusCode: 500,
        headers,
        body: JSON.stringify(e, response)
      })
    }
  } else {
    return callback(null, {
      statusCode: 401,
      headers,
      body: ''
    })
  }
}
