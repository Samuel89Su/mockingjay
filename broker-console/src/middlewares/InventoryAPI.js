const contentTypeHeader = { 'Content-Type': 'application/json' }

const InventoryAPI = {
  fetchUserCfg: {
    url: '../control/fetchUserConfig',
    method: 'POST'
  },
  updateUserCfg: {
    url: '../control/updateUserConfig',
    method: 'POST',
    headers: contentTypeHeader
  }
}

export default InventoryAPI
