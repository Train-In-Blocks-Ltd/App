const axios = require('axios')
const qs = require('querystring')
const auth_header = 'SSWS 00HqfFqOGTIaDz0MENWiQ_mVVe7-a2OWJaLrB4L6a6'
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
  const access_token = event.headers.authorization.split(' ')
  const response = await axios.post('https://dev-183252.okta.com/oauth2/default/v1/introspect?client_id=0oa3xeljtDMSTwJ3h4x6', qs.stringify({
    token: access_token[1],
    token_type_hint: 'access_token'
  }),
  {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  if (event.httpMethod === 'OPTIONS') {
    return callback(null, {
      statusCode: 200,
      headers: headers,
      body: ''
    })
  } else if (event.body && response.data.active === true) {
    const data = JSON.parse(event.body)
    if (data.type === 'POST') {
      try {
        const response = await axios.post("https://dev-183252.okta.com/api/v1/users/" + data.url, data.body,
          {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': auth_header
            }
          }
        )
        return callback(null, {
          statusCode: 200,
          headers: headers,
          body: JSON.stringify(response.data)
        })
      } catch (e) {
        return callback(null, {
          statusCode: 502,
          headers: headers,
          body: JSON.stringify(e)
        })
      }
    } else if (data.type === 'GET' && response.data.active === true) {
      try {
        const response = await axios.get("https://dev-183252.okta.com/api/v1/users/" + data.url,
          {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': auth_header
            }
          }
        )
        return callback(null, {
          statusCode: 200,
          headers: headers,
          body: JSON.stringify(response.data)
        })
      } catch (e) {
        return callback(null, {
          statusCode: 502,
          headers: headers,
          body: JSON.stringify(e)
        })
      }
    }
  } else {
    return callback(null, {
      statusCode: 401,
      headers: headers,
      body: ''
    })
  }
}
