import queryString from 'query-string';
const create = async (credentials, sales) => {

  try {
    let response = await fetch('/api/sales/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      },
      body: JSON.stringify(sales)
    })
    return await response.json()
  } catch(err) {
    console.log(err)
  }
}

const listByUser = async(params, credentials, signal) => {
  const query = queryString.stringify(params)

  try {
    let response = await fetch('api/sales?'+query, {
      method: 'GET',
      signal: signal,
      headers: { 
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      }
    })
    return await response.json()
  } catch(err){
    console.log(err)
  }
}