import axios from 'axios';


export async function get(url: any, headers: any, responseType: any) {
  try {
    return await axios.get(url,
      {
        headers: headers,
        responseType: responseType
      });
  } catch (e) {
    console.log(e);
  }
}


export async function post(url: any, data: any, headers: any, responseType: any) {
  try {
    return await axios.post(url,
      JSON.stringify(data), {
      headers: headers,
      responseType: responseType
    })
  } catch (e) {
    console.log(e);
  }
}