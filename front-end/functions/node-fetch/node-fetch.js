/* eslint-disable */
const fetch = require('node-fetch')
exports.handler = async function(event, context) {
  try {
    const url = event.queryStringParameters.url;
    const authorization = JSON.parse(event.queryStringParameters.authorization);
    const method = event.httpMethod;
    const body = event.body;
    const headers = event.headers;
    console.log('sending request from function with... ',url, method, body, headers, authorization);
    const response = await fetch(url, {
      method: method,
      headers: {...headers, authorization: authorization},
      body: body,
    })
    if (!response.ok) {
      // NOT res.status >= 200 && res.status < 300
      return { statusCode: response.status, body: response.statusText }
    }
    const data = await response.json()

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    }
  } catch (err) {
    console.log(err) // output to netlify function log
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: err.message }), // Could be a custom message or object i.e. JSON.stringify(err)
    }
  }
}
