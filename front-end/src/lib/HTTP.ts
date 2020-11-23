import { auth } from "../components/App";

const getAuthorizationHeader = async (): Promise<string>=>{
    const token = await auth().currentUser ? await auth().currentUser!.getIdToken() : 'not logged in';
    const authorization = `Bearer ${token}`;
    return authorization;
}
const getFunctionURL = (endpoint: string, baseURL: string): string =>{
    return '/.netlify/functions/node-fetch?url='+baseURL+endpoint;
}
type MethodNames = 'POST' | 'GET' | 'PUT' | 'DELETE' | 'OPTIONS';
const getRequestOptions = (method: MethodNames = 'GET', headers?: Headers ,body?: any): RequestInit =>{
    const optionsReturnObject: RequestInit  = {}
    if (method) {optionsReturnObject['method'] = method}
    if (body) {optionsReturnObject['body'] = JSON.stringify(body)}
    if (headers) {optionsReturnObject['headers'] = headers}
    return optionsReturnObject;
}
const getHeaders = async (authorization?: boolean, contentType?: string): Promise<Headers> => {
    const headersReturnObject: any = {};
    if (authorization) {headersReturnObject['authorization'] = await getAuthorizationHeader()}
    if (contentType){headersReturnObject['Content-Type'] = contentType}
    return headersReturnObject;
}
const netlifyGetRequest = async (endpoint: string, baseURL: string): Promise<JSON | null> => {
    const headers: Headers = await getHeaders(true);
    const response: JSON | null = await fetch(getFunctionURL(endpoint, baseURL), getRequestOptions('GET', headers))
        .then(data => data ? data.json() : null)
        .catch(error => { console.log(error) });
    return response || null;
};
const netlifyPostRequest = async (endpoint: string, baseURL: string, body: JSON): Promise<JSON | null> => {
    const headers: Headers = await getHeaders(true, 'application/json');
    const response: JSON|null = await fetch(getFunctionURL(endpoint, baseURL), getRequestOptions('POST',headers,body))
        .then(data => data ? data.json() : null)
        .catch(error => { console.log(error); });
    return await response || null;
}

const localGetRequest = async (endpoint: string, baseURL: string): Promise<JSON | null> => {
    const headers: Headers= await getHeaders(true);
    const response: JSON | null = await fetch(baseURL+endpoint, getRequestOptions('GET', headers))
        .then(data => data ? data.json() : null)
        .catch(error => { console.log(error) });
    return await response;
}

const localPostRequest = async (endpoint: string, baseURL: string, body: JSON): Promise<JSON | null> => {
    const headers: Headers= await getHeaders(true, 'application/json');
    const response: JSON | null = await fetch(baseURL+endpoint, getRequestOptions('POST', headers, body))
        .then(data => data ? data.json() : null)
        .catch(error => { console.log(error) });
    return await response;
}

const getBaseURL = () => {
    if (window.location.host.includes('localhost')) return 'http://localhost:8000';
    return 'http://api.theplacefor.me';
}
const needNetlifyFunction = () => {
    if (window.location.host.includes('localhost')) return false;
    return true;
}
export const getRequest = async (endpoint: string): Promise<JSON | null> => {
    if (needNetlifyFunction()) return await netlifyGetRequest(endpoint, getBaseURL());
    return await localGetRequest(endpoint, getBaseURL());
}
export const postRequest = async (endpoint: string, body: JSON): Promise<JSON | null> => {
    if (needNetlifyFunction()) return await netlifyPostRequest(endpoint, getBaseURL(), body);
    return await localPostRequest(endpoint, getBaseURL(), body);
}


