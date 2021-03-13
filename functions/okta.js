
const qs = require('querystring')
const axios = require('axios')
const authHeader = 'SSWS 00r26hoJMP9lITIbqrR596dGTWAL0I8lFljhdxfaBV'
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
    const data = JSON.parse(event.body)
    if (data.type === 'POST') {
      try {
        response = await axios.post('https://dev-183252.okta.com/api/v1/users/' + data.url, data.body,
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: authHeader
            }
          }
        )
        return callback(null, {
          statusCode: 200,
          headers,
          body: JSON.stringify(response.data)
        })
      } catch (e) {
        if (response.status === 400 && data.url.includes('suspend')) {
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
    } else if (data.type === 'GET' && response.data.active) {
      try {
        const response = await axios.get('https://dev-183252.okta.com/api/v1/users/' + data.url,
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: authHeader
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
      body: ''
    })
  }
}
