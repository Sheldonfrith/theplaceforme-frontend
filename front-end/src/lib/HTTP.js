import { auth } from "../components/App";

const baseURL = 'http://localhost:3001';

export const getRequest = async (endpoint) => {
  const url = baseURL+endpoint;
  const token = await auth().currentUser.getIdToken();
  console.log('making api request to '+url+' with token '+(token));
  const response = await fetch(url, {
    headers: { authorization: `Bearer ${token}` },
  }).then(data => data?data.json():null)
  .catch(error => {console.log(error)});
  console.log(response);

  return response? response: null;
};

export const postRequest = async (endpoint, body) => {
    const url = baseURL+endpoint;
    const token = await auth().currentUser.getIdToken();
    console.log('making post request to '+url+' with token '+(token));
    const response = await fetch(url,{
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type':'application/json',
            authorization: `Bearer ${token}`
        },
    }).then(data=> data?data.json():null)
    .catch(error=>{console.log(error);});

    console.log(response);
    return response? response: null;
}