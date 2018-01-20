import { errHandler } from '../actions/index'

const fetchJson = function(url, opts) {
    return fetch(url, opts)
    .then(res => {
        var contentType = res.headers.get('content-type')
        if (!res.ok) {
          return []
        } else if (!contentType || !contentType.includes('application/json')) {
          return []
        } else if (contentType && contentType.includes('application/json')) {
          return res.json()
        }
    })
    .then(retData => {
        if (retData.code !== 0) {
          return
        } else {
          if (retData.data && retData.data.length > 0) {
            return retData.data
          }
        }
      })
    .catch(ex => {
        return []
    })
}

const fetchRemote = function(api, payload) {

    return function(dispatch) {
        if (!api) {
            return dispatch(errHandler(new Error('api not found in config')))
        }

        api.body = payload
        return fetchJson(api.url, api)
    }
}

export { fetchRemote }