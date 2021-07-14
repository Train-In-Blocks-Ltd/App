const qs = require('querystring')
const axios = require('axios')
const smtpTransport = require('nodemailer-smtp-transport')
const nodemailer = require('nodemailer')
const CUSTOM_ENV = require('../config/prod.env')
const headers = require('./helpers/headers')
const transporter = nodemailer.createTransport(smtpTransport({
  service: 'gmail',
  host: 'smtp-relay.gmail.com',
  secure: true,
  auth: {
    user: CUSTOM_ENV.GOOGLE_WORKSPACE.USERNAME,
    pass: CUSTOM_ENV.GOOGLE_WORKSPACE.PASSWORD
  }
}))

let response

exports.handler = async function handler (event, context, callback) {
  const accessToken = event.headers.authorization.split(' ')
  response = await axios.post(`https://dev-183252.okta.com/oauth2/default/v1/introspect?client_id=${CUSTOM_ENV.CLIENT_ID}`,
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
      const data = JSON.parse(event.body)
      // options
      const mailOptions = {
        from: 'Train In Blocks <hello@traininblocks.com>',
        to: data.to, // from req.body.to
        subject: data.subject, // from req.body.subject
        text: data.text,
        html: data.html // from req.body.message
      }
      await transporter.sendMail(mailOptions)
      return callback(null, {
        statusCode: 200,
        headers,
        body: 'Email sent successfully'
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
      body: ''
    })
  }
}
