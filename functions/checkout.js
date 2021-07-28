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
        if (JSON.parse(event.body).productId && JSON.parse(event.body).ptId && JSON.parse(event.body).email) {
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
          const db = await axios.get(`https://api.traininblocks.com/v2/${JSON.parse(event.body).ptId}`, {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: CUSTOM_ENV.TIB_API
            }
          })
          const product = db.data[5].find(product => product.id === JSON.parse(event.body).productId)
          let session
          let recurring
          if (product.type === 'monthly') {
            recurring = 'month'
          } else if (product.type === 'monthly') {
            recurring = 'year'
          }
          // Create checkout session
          if (product.type === 'one-off') {
            session = await stripe.checkout.sessions.create({
              payment_method_types: ['card'],
              customer_email: JSON.parse(event.body).email,
              line_items: [{
                price_data: {
                  currency: product.currency,
                  product_data: {
                    name: product.name,
                    description: product.notes
                  },
                  unit_amount: product.price
                },
                quantity: 1
              }],
              payment_intent_data: {
                application_fee_amount: Math.round(0.5 + product.price * 0.5),
                transfer_data: {
                  destination: Okta.data[0].profile.connectedAccountId
                }
              },
              mode: 'payment',
              success_url: event.multiValueHeaders.referer[0] === 'https://app.traininblocks.com/clientUser' ? 'https://app.traininblocks.com/clientUser' : 'https://dev.traininblocks.com/clientUser',
              cancel_url: event.multiValueHeaders.referer[0] === 'https://app.traininblocks.com/clientUser' ? 'https://app.traininblocks.com/clientUser' : 'https://dev.traininblocks.com/clientUser'
            })
          } else {
            session = await stripe.checkout.sessions.create({
              payment_method_types: ['card'],
              customer_email: JSON.parse(event.body).email,
              line_items: [{
                price_data: {
                  currency: product.currency,
                  product_data: {
                    name: product.name,
                    description: product.notes
                  },
                  unit_amount: product.price,
                  recurring: {
                    interval: recurring
                  }
                },
                quantity: 1
              }],
              subscription_data: {
                application_fee_percent: 0.05,
                transfer_data: {
                  destination: Okta.data[0].profile.connectedAccountId
                }
              },
              mode: 'subscription',
              success_url: event.multiValueHeaders.referer[0] === 'https://app.traininblocks.com/clientUser' ? 'https://app.traininblocks.com/clientUser' : 'https://dev.traininblocks.com/clientUser',
              cancel_url: event.multiValueHeaders.referer[0] === 'https://app.traininblocks.com/clientUser' ? 'https://app.traininblocks.com/clientUser' : 'https://dev.traininblocks.com/clientUser'
            })
          }
          // Include url in response
          return callback(null, {
            statusCode: 200,
            headers,
            body: session.id
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
