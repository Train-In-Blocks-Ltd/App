const stripe = require('stripe')('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')

exports.handler = async function handler (event, context, callback) {
  if (event.body) {
    try {
      const link = await stripe.billingPortal.sessions.create({
        customer: JSON.parse(event.body).id,
        return_url: 'https://app.traininblocks.com/account'
      })
      return callback(null, {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*'
        },
        body: JSON.stringify(link.url)
      })
    } catch (e) {
      return callback(null, {
        statusCode: 502,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*'
        },
        body: ''
      })
    }
  } else {
    return callback(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*'
      },
      body: ''
    })
  }
}
