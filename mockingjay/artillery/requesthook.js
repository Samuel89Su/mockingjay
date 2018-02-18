  module.exports = {
    updateJSONBody: updateJSONBody,
    logHeaders: logHeaders
  }

  function updateJSONBody(requestParams, context, ee, next) {
    let random = Math.floor(Math.random()*1000)
    requestParams.json = {
        "id": 0,
        "name": "test-"+random,
        "desc": "test "+random,
        "apiForwardTarget": "dev",
        "targets": [
          {
            "name": "dev",
            "value": "http://127.0.0.1:"+random
          }
        ]
      }

    return next()
  }

  function logHeaders(requestParams, response, context, ee, next) {
    // console.log(response.headers)
    return next()
  }
