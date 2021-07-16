/*
Requires:
  ptId: this.clientUser.pt_id
  productId:
*/
const qs = require('querystring')
const axios = require('axios')
const CUSTOM_ENV = process.env.NODE_ENV === 'production' ? require('../config/prod.env') : require('../config/dev.env')
/* eslint-disable-next-line */
const stripe = require('stripe')(CUSTOM_ENV.STRIPE)
const headers = require('././helpers/headers')

let response

exports.handler = async function handler (event, context, callback) {
  if (event.headers.authorization) {
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
        if (JSON.parse(event.body).productId) {
          // Get Connected Account Id
          const Okta = await axios.get(`https://dev-183252.okta.com/api/v1/users/?filter=id+eq+"${JSON.parse(event.body).ptId}"&limit=1`,
            {
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: CUSTOM_ENV.OKTA.AUTH_KEY
              }
            }
          )
          // Search db for productId
          const db = await axios.get('https://api.traininblocks.com/v2', {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: CUSTOM_ENV.TIB_API
            }
          })
          const product = db.data[5].find(product => product.id === JSON.parse(event.body).productId)
          // Create checkout session
          const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
              name: product.title,
              amount: product.price,
              currency: 'gbp',
              quantity: 1
            }],
            payment_intent_data: {
              application_fee_amount: 0.5 + product.price * 0.05,
              transfer_data: {
                destination: Okta.data[0].profile.connectedAccountId
              }
            },
            mode: 'payment',
            success_url: 'https://example.com/success',
            cancel_url: 'https://example.com/failure'
          })
          // Include url in response
          return callback(null, {
            statusCode: 200,
            headers,
            body: session.url
          })
        } else {
          return callback(null, {
            statusCode: 400,
            headers,
            body: 'Incorrect Parameters'
          })
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
        body: '401 - Unauthorized'
      })
    }
  } else {
    return callback(null, {
      statusCode: 401,
      headers,
      body: '401 - Unauthorized'
    })
  }
}
