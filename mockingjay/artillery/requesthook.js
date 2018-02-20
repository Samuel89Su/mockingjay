module.exports = {
  prepareApp: prepareApp,
  logHeaders: logHeaders,
  prepareApi: prepareApi
}

function prepareApp (requestParams, context, ee, next) {
  let timestamp = (new Date().getTime() - Date.parse('2018')).toString()
  let name = "test-" + timestamp
  let url = "http://127.0.0.1:" + timestamp
  requestParams.json = {
    "id": 0,
    "name": name,
    "desc": name,
    "apiForwardTarget": "dev",
    "targets": [
      {
      "name": "dev",
      "value": url
      }
    ]
  }

  // console.log(JSON.stringify(requestParams))

  return next()
}

function prepareApi (requestParams, context, ee, next) {
  let timestamp = (new Date().getTime() - Date.parse('2018')).toString()
  requestParams.json = {
    "appId": 2,
    "id": 0,
    "name": timestamp,
    "description": timestamp,
    "path": "/api/" + timestamp,
    "method": "POST",
    "validate": true,
    "forward": false
  }

  return next()
}

function logHeaders (requestParams, response, context, ee, next) {
  // console.log(response.headers)
  return next()
}