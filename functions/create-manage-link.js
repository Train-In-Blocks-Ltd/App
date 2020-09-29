const stripe = require('stripe')('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')

const headers = `
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    'Content-Type': 'application/json; charset=UTF-8',
    'X-Frame-Options': 'DENY',
    'Strict-Transport-Security': 'max-age=15552000; preload',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
    'Content-Security-Policy': 'default-src "self"'
  }
`

exports.handler = async function handler (event, context, callback) {
  if (JSON.parse(event.body).id) {
    try {
      const link = await stripe.billingPortal.sessions.create({
        customer: JSON.parse(event.body).id,
        return_url: 'https://app.traininblocks.com/account'
      })
      return callback(null, {
        statusCode: 200,
        headers: headers,
        body: JSON.stringify(link.url)
      })
    } catch (e) {
      return callback(null, {
        statusCode: 502,
        headers: headers,
        body: ''
      })
    }
  } else if (handler.httpMethod === 'OPTIONS') {
    return callback(null, {
      statusCode: 200,
      headers: headers,
      body: ''
    })
  } else {
    return callback(null, {
      statusCode: 401,
      headers: headers,
      body: ''
    })
  }
}
