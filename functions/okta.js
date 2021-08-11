const qs = require('querystring')
const axios = require('axios')
const CUSTOM_ENV = process.env.NODE_ENV === 'production' ? require('./helpers/prod.env') : require('./helpers/dev.env')
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
      const data = JSON.parse(event.body)
      if (data.type === 'POST') {
        try {
          response = await axios.post('https://dev-183252.okta.com/api/v1/users/' + data.url, data.body,
            {
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: CUSTOM_ENV.OKTA.AUTH_KEY
              }
            }
          )
          return callback(null, {
            statusCode: 200,
            headers,
            body: JSON.stringify(response.data)
          })
        } catch (e) {
          if (data.url.includes('suspend')) {
            return callback(null, {
              statusCode: 200,
              headers,
              body: 'Archived Successfully'
            })
          }
          return callback(null, {
            statusCode: 500,
            headers,
            body: JSON.stringify(e, response)
          })
        }
      } else if (data.type === 'GET') {
        try {
          const response = await axios.get('https://dev-183252.okta.com/api/v1/users/' + data.url,
            {
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: CUSTOM_ENV.OKTA.AUTH_KEY
              }
            }
          )
          return callback(null, {
            statusCode: 200,
            headers,
            body: JSON.stringify(response.data)
          })
        } catch (e) {
          return callback(null, {
            statusCode: 500,
            headers,
            body: JSON.stringify(e, response)
          })
        }
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
