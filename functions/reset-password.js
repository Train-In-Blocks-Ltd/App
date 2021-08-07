const emailBuilder = require('../src/components/js/email')

const axios = require('axios')
const smtpTransport = require('nodemailer-smtp-transport')
const nodemailer = require('nodemailer')
const CUSTOM_ENV = process.env.NODE_ENV === 'production' ? require('../config/prod.env') : require('../config/dev.env')
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
  if (event.httpMethod === 'OPTIONS') {
    return callback(null, {
      statusCode: 200,
      headers,
      body: ''
    })
  } else if (event.body) {
    const data = JSON.parse(event.body)
    if (data.email !== 'demo@traininblocks.com') {
      try {
        const oktaOne = await axios.get(`https://dev-183252.okta.com/api/v1/users/?filter=profile.email+eq+"${data.email}"&limit=1`,
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: CUSTOM_ENV.OKTA.AUTH_KEY
            }
          }
        )
        const id = oktaOne.data[0].id
        const oktaTwo = await axios.post(`https://dev-183252.okta.com/api/v1/users/${id}/lifecycle/reset_password?sendEmail=false`,
          {},
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: CUSTOM_ENV.OKTA.AUTH_KEY
            }
          }
        )
        // options
        const LINK = oktaTwo.data.resetPasswordUrl.replace(CUSTOM_ENV.OKTA.ISSUER, 'https://auth.traininblocks.com')
        const mailOptions = {
          from: 'Train In Blocks <hello@traininblocks.com>',
          to: data.email,
          ...emailBuilder('password-reset', { link: LINK })
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
