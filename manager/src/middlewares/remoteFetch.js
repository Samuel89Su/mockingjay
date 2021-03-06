const fetchJson = function (url, opts) {
  return fetch(url, opts)
    .then(res => {
      var contentType = res.headers.get('content-type')
      if (!res.ok) {
        return null
      } else if (!contentType || !contentType.includes('application/json')) {
        return null
      } else if (contentType && contentType.includes('application/json')) {
        return res.json()
      }
    })
    .then(retData => {
      if (retData.code !== 0) {
        return null
      } else {
        if (retData.data) {
          return retData.data
        }
      }
    })
    .catch(ex => {
      return null
    })
}

const fetchRemote = function (api, payload) {
  api.body = payload
  return fetchJson(api.url, api)
}

function fakeDiscard(api, payload) {
  return new Promise((resolve, reject) => { resolve = ()=>{ return true }; reject = ()=>{ return false } })
}

export {
  fetchRemote, fakeDiscard
}
