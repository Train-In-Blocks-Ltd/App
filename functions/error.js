// This code sample uses the 'node-fetch' library:
// https://www.npmjs.com/package/node-fetch
const qs = require('querystring')
const axios = require('axios')
const beautify = require('json-beautify')
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
function bodyData (msg, claims) {
  return `{
    "update": {},
    "fields": {
      "summary": "Auto Logged Bug",
      "issuetype": {
        "id": "10001"
      },
      "project": {
        "id": "10002"
      },
      "description": {
        "type": "doc",
        "version": 1,
        "content": [
          {
            "type": "paragraph",
            "content": [
              {
                "text": ${JSON.stringify('Error Description: ' + beautify(msg, null, 2, 100))},
                "type": "text"
              }
            ]
          },
          {
            "type": "paragraph",
            "content": [
              {
                "text": ${JSON.stringify('User Claims: ' + beautify(claims, null, 2, 100))},
                "type": "text"
              }
            ]
          }
        ]
      },
      "reporter": {
        "id": "5ee7c9bc0856d00ac34be40b"
      },
      "assignee": {
        "id": "70121:744ad724-08a1-4a6c-8417-76ad65719a96"
      }
    }
  }`
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
    try {
      const atlassian = await axios.post('https://traininblocks.atlassian.net/rest/api/3/issue',
        bodyData(data.msg, data.claims),
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              'joe.bailey@traininblocks.com:FE98Xa9rXzGV1w7Ut6YXD397'
            ).toString('base64')}`,
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        })
      return callback(null, {
        statusCode: 200,
        headers,
        body: JSON.stringify(atlassian.data)
      })
    } catch (e) {
      return callback(null, {
        statusCode: 500,
        headers,
        body: JSON.stringify(e.response.data)
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
