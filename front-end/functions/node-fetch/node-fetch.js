/* eslint-disable */
const fetch = require('node-fetch')
exports.handler = async function(event, context) {
  try {
    const url = event.queryStringParameters.url;
    const me thod = event.httpMethod;
    const body = event.body;
    const authorization = event.headers.authorization;
    const options = body? {
      method: method,
      headers: {
        'Content-Type':'application/json',
        authorization: authorization},
      body: body
    }:{
      method: method,
      headers: {authorization: authorization},
    };
    console.log('sending request from function with... ',url, options);

    const response = await fetch(url, options)
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
