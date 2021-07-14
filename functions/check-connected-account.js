
const qs = require('querystring')
const axios = require('axios')
const stripe = require('stripe')('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')
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json; charset=UTF-8',
  'X-Frame-Options': 'DENY',
  'Strict-Transport-Security': 'max-age=15552000; preload',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'Content-Security-Policy': 'default-src "self"'
}

let response

exports.handler = async function handler (event, context, callback) {
  const accessToken = event.headers.authorization.split(' ')
  response = await axios.post('https://dev-183252.okta.com/oauth2/default/v1/introspect?client_id=0oa3xeljtDMSTwJ3h4x6',
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
      console.log(event.multiValueHeaders.referer[0])
      if (JSON.parse(event.body).connectedAccountId) {
        const account = await stripe.accounts.retrieve(
          JSON.parse(event.body).connectedAccountId
        )
        console.log(account)
        if (account.id !== 'acct_1GLXT9BYbiJubfJM' && account.charges_enabled) {
          return callback(null, {
            statusCode: 200,
            headers,
            body: 'true'
          })
        } else {
          return callback(null, {
            statusCode: 200,
            headers,
            body: 'false'
          })
        }
      } else {
        return callback(null, {
          statusCode: 200,
          headers,
          body: 'false'
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
      body: ''
    })
  }
}
