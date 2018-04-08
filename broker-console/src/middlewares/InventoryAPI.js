const contentTypeHeader = { 'Content-Type': 'application/json' }

const InventoryAPI = {
  fetchUserCfg: {
    url: '../control/fetchUserConfig',
    method: 'GET'
  },
  updateUserCfg: {
    url: '../control/updateUserConfig',
    method: 'POST',
    headers: contentTypeHeader
  }
}

export default InventoryAPI
