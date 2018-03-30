const contentTypeHeader = { 'Content-Type': 'application/json' }

const InventoryAPI = {
  fetchProxyCfg: {
    url: '/control/fetchconfig',
    method: 'GET'
  },
  updateProxyCfg: {
    url: '/control/updateProxyCfg',
    method: 'POST',
    headers: contentTypeHeader
  }
}

export default InventoryAPI
