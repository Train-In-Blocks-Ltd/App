const key = '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'
const axios = require('axios')
const qs = require('querystring')
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
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  )
  if (event.httpMethod === 'OPTIONS') {
    return callback(null, {
      statusCode: 200,
      headers: headers,
      body: ''
    })
  } else if (event.body && response.data.active === true) {
    try {
      var data = JSON.parse(event.body)
      sendgrid.setApiKey(key)
      const msg = {
        to: data.to,
        from: 'Train In Blocks <no-reply@traininblocks.com>',
        subject: data.subject,
        text: data.text,
        html: data.html
      }
      await sendgrid.send(msg)
      return callback(null, {
        statusCode: 200,
        headers: headers,
        body: 'Email sent successfully'
      })
    } catch (e) {
      return callback(null, {
        statusCode: 502,
        headers: headers,
        body: JSON.stringify(e, response)
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
