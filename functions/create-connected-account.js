const qs = require('querystring')
const axios = require('axios')
const CUSTOM_ENV = process.env.NODE_ENV === 'production' ? require('./helpers/prod.env') : require('./helpers/dev.env')
/* eslint-disable-next-line */
const stripe = require('stripe')(CUSTOM_ENV.STRIPE.SECRET_KEY)
const headers = require('./helpers/headers')

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
        let account = {
          id: ''
        }
        if (JSON.parse(event.body).connectedAccountId) {
          const preAccount = await stripe.accounts.retrieve(
            JSON.parse(event.body).connectedAccountId
          )
          if (preAccount.id !== 'acct_1GLXT9BYbiJubfJM') {
            account.id = preAccount.id
          } else {
            account = await stripe.accounts.create({
              type: 'standard',
              email: JSON.parse(event.body).email
            })
          }
        } else {
          account = await stripe.accounts.create({
            type: 'standard',
            email: JSON.parse(event.body).email
          })
        }
        const accountLinks = await stripe.accountLinks.create({
          account: account.id,
          refresh_url: event.multiValueHeaders.referer[0] === 'https://app.traininblocks.com/portfolio' ? 'https://app.traininblocks.com/portfolio' : 'https://dev.traininblocks.com/portfolio',
          return_url: event.multiValueHeaders.referer[0] === 'https://app.traininblocks.com/portfolio' ? 'https://app.traininblocks.com/portfolio' : 'https://dev.traininblocks.com/portfolio',
          type: 'account_onboarding'
        })
        return callback(null, {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            connectedAccountId: account.id,
            url: accountLinks.url
          })
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
