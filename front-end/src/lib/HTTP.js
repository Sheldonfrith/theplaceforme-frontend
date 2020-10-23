import { auth } from "../components/App";

export const netlifyGetRequest = async (endpoint, baseURL, functionBaseURL) => {
    const url = baseURL+endpoint;
    const token = auth().currentUser?await auth().currentUser.getIdToken():'not logged in';
    const authorization = `Bearer ${token}`;
    const functionURL = functionBaseURL + '/?url='+url;
    const response = await fetch(functionURL, {headers: {authorization: authorization}})
    .then(data=>data?data.json():null)
    .catch(error=>{console.log(error)});
  
    // console.log('making api request to '+url+' with token '+(token));
    // const response = await fetch(url, {
    //   headers: { authorization: `Bearer ${token}` },
    // }).then(data => data?data.json():null)
    // .catch(error => {console.log(error)});
    // console.log(response);
  
    return response? response: null;
  };
  
  export const netlifyPostRequest = async (endpoint, baseURL, functionBaseURL, body) => {
      const url = baseURL+endpoint;
      const token = auth().currentUser?await auth().currentUser.getIdToken():'not logged in';
      const authorization =`Bearer ${token}`;
      const functionURL = functionBaseURL+'?url='+url;
     
      console.log('making post request to '+url);
      const response = await fetch(functionURL,{
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
              'Content-Type':'application/json',
              authorization: authorization,
          },
      }).then(data=> data?data.json():null)
      .catch(error=>{console.log(error);});
  
      // console.log(response);
      return await response? response: null;
  }
  const localGetRequest = async (endpoint, baseURL) =>{
    const token = auth().currentUser?await auth().currentUser.getIdToken():'not logged in';
    const url = baseURL+endpoint;
    const response = await fetch(url, {
          headers: { authorization: `Bearer ${token}` },
        }).then(data => data?data.json():null)
        .catch(error => {console.log(error)});
    return await response;
}

const localPostRequest = async (endpoint, baseURL, body)=>{
    const token = auth().currentUser?await auth().currentUser.getIdToken():'not logged in';
    const url = baseURL+endpoint;
    const fetchOptions = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`,
        }
    }
    const response = await fetch(url,fetchOptions)
    .then(data=>data?data.json():null)
    .catch(error=>console.log(error));
    return await response;
}

export const getRequest = async(endpoint)=>{
    if (window.location.host.includes('localhost')){
        console.log('sending local get request');
        const baseURL = 'http://localhost:8000';
        return await localGetRequest(endpoint, baseURL);
    } else {
        const baseURL = 'http://api.theplacefor.me';
        const functionBaseURL = '/.netlify/functions/node-fetch';
        return await netlifyGetRequest(endpoint, baseURL, functionBaseURL);
    }
}
export const postRequest = async (endpoint, body)=>{
    if (window.location.host.includes('localhost')){
        const baseURL = 'http://localhost:8000';
        return await localPostRequest(endpoint, baseURL, body);
    } else {
        const baseURL = 'http://api.theplacefor.me';
        const functionBaseURL = '/.netlify/functions/node-fetch';
        return await netlifyPostRequest(endpoint, baseURL, functionBaseURL, body);
    }
}


