module.exports = {
  prepareApp: prepareApp,
  logHeaders: logHeaders,
  prepareApi: prepareApi
}

function prepareApp (requestParams, context, ee, next) {
  let timestamp = new Date().getTime() - Date.parse('2018')
  requestParams.json = {
    "id": 0,
    "name": "test-" + timestamp,
    "desc": "test " + timestamp,
    "apiForwardTarget": "dev",
    "targets": [{
      "name": "dev",
      "value": "http://127.0.0.1:" + timestamp
    }]
  }

  return next()
}

function prepareApi (requestParams, context, ee, next) {
  let timestamp = new Date().getTime() - Date.parse('2018')
  requestParams.json = {
    "appId": 1,
    "id": 0,
    "name": timestamp.toString(),
    "description": timestamp.toString(),
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