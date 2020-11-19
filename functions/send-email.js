const axios = require('axios')
const qs = require('querystring')
const smtpTransport = require('nodemailer-smtp-transport')
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
// setup nodemailer
const nodemailer = require('nodemailer')
let transporter = nodemailer.createTransport(smtpTransport({
  service: 'gmail',
  host: 'smtp-relay.gmail.com',
  secure: true,
  auth: {
    user: 'joe.bailey@traininblocks.com',
    pass: 'Bagheera26'
  }
}))

exports.handler = async function handler (event, context, callback) {
  const accessToken = event.headers.authorization.split(' ')
  const response = await axios.post('https://dev-183252.okta.com/oauth2/default/v1/introspect?client_id=0oa3xeljtDMSTwJ3h4x6',
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
      // options
      const mailOptions = {
        from: 'Train In Blocks <hello@traininblocks.com>',
        to: data.to,                   // from req.body.to
        subject: data.subject,         // from req.body.subject
        text: data.text,
        html: data.html         // from req.body.message
      }
      await transporter.sendMail(mailOptions)
      return callback(null, {
        statusCode: 200,
        headers: headers,
        body: 'Email sent successfully'
      })
    } catch (e) {
      return callback(null, {
        statusCode: 502,
        headers: headers,
        body: JSON.stringify(e)
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
