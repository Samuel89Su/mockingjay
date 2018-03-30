const contentTypeHeader = { 'Content-Type': 'application/json' }

const InventoryAPI = {
  updateProxyCfg: {
    url: '/control/updateProxyCfg',
    method: 'POST',
    headers: contentTypeHeader
  }
}

export default InventoryAPI
