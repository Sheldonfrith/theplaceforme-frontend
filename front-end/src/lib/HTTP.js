import { auth } from "../components/App";

const baseURL = 'http://api.theplacefor.me';
const functionBaseURL = '/.netlify/functions/node-fetch';

export const getRequest = async (endpoint) => {
  const url = baseURL+endpoint;
  const token = await auth().currentUser.getIdToken();
  const authorization = `Bearer ${token}`;
  const functionURL = functionBaseURL + '/?url='+url+'?authorization='+authorization;
  const response = await fetch(functionURL)
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

export const postRequest = async (endpoint, body) => {
    const url = baseURL+endpoint;
    const token = await auth().currentUser.getIdToken();
    const authorization =`Bearer ${token}`;
    const functionURL = functionBaseURL+'?url='+url+'?authorization='+authorization;
   
    console.log('making post request to '+url);
    const response = await fetch(url,{
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type':'application/json'
        },
    }).then(data=> data?data.json():null)
    .catch(error=>{console.log(error);});

    // console.log(response);
    return response? response: null;
}