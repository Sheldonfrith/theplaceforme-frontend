/* eslint-disable */
const fetch = require('node-fetch')
exports.handler = async function(event, context) {
  try {
    const queryParamNames = Object.keys(event.queryStringParameters);
    const queryParamsCount = queryParamNames.length;
    let url = '';
    if (queryParamsCount>1){
      //there are query params that need to be dealt with
      url = queryParamNames.map((paramName,index)=>{
        if (paramName==='url'){
          //url query param generally includes the first query param, so add an & behind it
          return event.queryStringParameters.url+'&';
        } else if (index === (queryParamsCount-1)) {
          //last query param, do not put an &
          return event.queryStringParameters[paramName];
         } else { 
           //regular query param
          return event.queryStringParameters[paramName]+'&';
        }
      }).join('');
    } else {
      //there are no query params to deal with
      url = event.queryStringParameters.url;
    }
    const method = event.httpMethod;
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
