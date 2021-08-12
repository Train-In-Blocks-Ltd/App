const qs = require('querystring')
const axios = require('axios')
const CUSTOM_ENV = process.env.NODE_ENV === 'production' ? require('./helpers/prod.env') : require('./helpers/dev.env')
/* eslint-disable-next-line */
const stripe = require('stripe')(CUSTOM_ENV.STRIPE.SECRET_KEY)
const headers = require('././helpers/headers')

let response

exports.handler = async function handler (event, context, callback) {
  if (event.headers.authorization) {
    const accessToken = event.headers.authorization.split(' ')
    response = await axios.post(`${CUSTOM_ENV.OKTA.ISSUER}/oauth2/default/v1/introspect?client_id=${CUSTOM_ENV.OKTA.CLIENT_ID}`,
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
        if (JSON.parse(event.body).email) {
          const coupon = await stripe.promotionCodes.create({
            coupon: 'Referee-20',
            code: JSON.parse(event.body).email.toUpperCase().replace(/[\W_]+/g, ''),
            metadata: {
              referrer: JSON.parse(event.body).email
            },
            restrictions: {
              first_time_transaction: true
            }
          })
          return callback(null, {
            statusCode: 200,
            headers,
            body: JSON.stringify(coupon)
          })
        } else {
          return callback(null, {
            statusCode: 400,
            headers,
            body: 'Please provide email address'
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
