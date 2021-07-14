
const qs = require('querystring')
const axios = require('axios')
const CUSTOM_ENV = require('../config/prod.env')
/* eslint-disable-next-line */
const stripe = require('stripe')(CUSTOM_ENV.STRIPE)
const headers = require('./helpers/headers')

let response

exports.handler = async function handler (event, context, callback) {
  const accessToken = event.headers.authorization.split(' ')
  response = await axios.post(`https://dev-183252.okta.com/oauth2/default/v1/introspect?client_id=${CUSTOM_ENV.CLIENT_ID}`,
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
      const link = await stripe.billingPortal.sessions.create({
        customer: JSON.parse(event.body).id,
        return_url: 'https://app.traininblocks.com/account'
      })
      return callback(null, {
        statusCode: 200,
        headers,
        body: link.url
      })
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
