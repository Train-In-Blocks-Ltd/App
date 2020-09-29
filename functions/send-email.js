const key = 'Bearer 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'

const sendgrid = require('@sendgrid/mail')

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

exports.handler = async function handler (event, context, callback) {
  if (handler.httpMethod === 'OPTIONS') {
    return callback(null, {
      statusCode: 200,
      headers: headers,
      body: ''
    })
  } else if (event.body) {
    try {
      sendgrid.setApiKey(key)
      const msg = {
        to: JSON.parse(event.body).to,
        from: 'Train In Blocks <no-reply@traininblocks.com>',
        subject: JSON.parse(event.body).subject,
        text: JSON.parse(event.body).text,
        html: JSON.parse(event.body).html
      }
      await sendgrid.send(msg)
      return callback(null, {
        statusCode: 200,
        headers: headers,
        body: 'Message Sent'
      })
    } catch (e) {
      return callback(null, {
        statusCode: 502,
        headers: headers,
        body: e
      })
    }
  } else {
    return callback(null, {
      statusCode: 401,
      headers: headers,
      body: ''
    })
  }
}
