function client(endpoint, customConfig = {}) {
  const url = `${process.env.REACT_APP_API_URL}/${endpoint}`
  const config = {
    method: "GET",
    ...customConfig
  }
  return window.fetch(url, config).then(async jsonResponse => await jsonResponse.ok ? jsonResponse.json() : Promise.reject(jsonResponse.json()))
}

export { client }

/*



























💰 spoiler alert below...



























































const config = {
    method: 'GET',
    ...customConfig,
  }
*/
