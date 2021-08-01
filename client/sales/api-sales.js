import queryString from 'query-string';
const create = async (credentials, sale) => {

  try {
    let response = await fetch('/api/sales/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      },
      body: JSON.stringify(sale)
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

const currentMonthPreview = async (credentials, signal) => {
  try {
    let response = await fetch('/api/sales/current/preview', {
      method: 'GET',
      signal: signal,
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      }
    })
    return await response.json()
  }catch(err){
    console.log(err)
  }
}

const salesByCategory = async (credentials, signal) => {
  try {
    let response = await fetch('/api/sales/by/category', {
      method: 'GET',
      signal: signal,
      headers:{
        'Accept':'application/json',
        'Authorization':'Bearer ' + credentials.t
      }
    })
    return await response.json()
  } catch(err){
    console.log(err)
  }
}

const averageCategories = async (params, credentials, signal) => {
  const query = queryString.stringify(params)
  try {
    let response = await fetch('/api/sales/category/averages?'+query, {
      method: 'GET',
      signal: signal,
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      }
    })
    return await response.json()
  }catch(err){
    console.log(err)
  }
}

const yearlySales = async (params, credentials, signal) => {
  const query = queryString.stringify(params)
  try {
    let response = await fetch('/api/sales/yearly?'+query, {
      method: 'GET',
      signal: signal,
      headers: { 
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      }
    })
    return await response.json()
  }catch(err) {
    console.log(err)
  }
}

const  plotSales = async (params, credentials, signal) => {
  const query = queryString.stringify(params)
  try {
    let  response = await fetch('/api/sales/plot?'+query, {
      method: 'GET',
      signal: signal,
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      }
    })
    return await response.json()
  }catch(err) {
    console.log(err)
  }
}

  const read = async(params, signal) => {
    try {
      let response = await fetch('/api/auction' + params.auctionId, {
        method: 'GET',
        signal: signal,
      })
      return response.json()
    } catch(err) {
      console.log(err)
    }
  }

  const update = async(params, credentials, sales) => {
    try {
      let response = await fetch('/api/sales/' + params.salesId, { 
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' +credentials.t
        },
        body: JSON.stringify(sales)
      } )
      return await response.json()
    } catch(err) {
      console.log(err)
    }
  }

  const remove = async(params, credentials) => {
    try {
      let response = await fetch('/api/sales/' + params.salesId, { 
        method: 'DELETE', 
        headers: { 
          'Accept': 'application/json', 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t
        }
      })
      return await response.json()
    } catch(err) {
      console.log(err)
    }
  }

  export {
    create,
    listByUser,
    currentMonthPreview,
    salesByCategory,
    averageCategories,
    yearlySales,
    plotSales,
    read,
    update,
    remove
  }