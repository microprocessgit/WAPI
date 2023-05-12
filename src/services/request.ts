import fetch from 'node-fetch';

export async function post(url: any, data: any) {
  try {
    const response = await fetch(url,
      {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { "Content-type": "application/json; charset=UTF-8" }
      });
    return await response.text();
  } catch (e) {
    console.log(e);
    return { message: e, statusCode: 500 };
  }
}

export async function get(url: any) {
  try {
    const response = await fetch(url,
      {
        method: 'GET',
        headers: { "Content-type": "application/json; charset=UTF-8" }
      });
    const res = await response.json();
    return res;
  } catch (e) {
    console.log(e);
    return { message: e, statusCode: 500 };
  }
}