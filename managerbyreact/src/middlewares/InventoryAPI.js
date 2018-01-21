const InventoryAPI = {
  appRegister: {
    url: '/inventory/app/register',
    method: 'POST'
  },
  appUpdate: {
    url: '/inventory/app/update',
    method: 'POST'
  },
  appDiscard: {
    url: '/inventory/app/discard',
    method: 'POST'
  },
  appList: {
    url: '/inventory/app/list',
    method: 'GET'
  },
  appGet: {
    url: '/inventory/app/get',
    method: 'GET'
  },
  apiList: {
    url: '/inventory/api/list',
    method: 'GET'
  },
  apiGet: {
    url: '/inventory/api/get',
    method: 'GET'
  },
  apiRegister: {
    url: '/inventory/api/register',
    method: 'POST'
  },
  apiUpdate: {
    url: '/inventory/api/update',
    method: 'POST'
  },
  apiDiscard: {
    url: '/inventory/api/discard',
    method: 'POST'
  },
  addMockCfg: {
    url: '/inventory/api/mockcfg',
    method: 'POST'
  },
  apiSchema: {
    url: '/inventory/api/getapischema',
    method: 'POST'
  },
  apiSchemaUpdate: {
    url: '/inventory/api/updateschema',
    method: 'POST'
  },
  apiMockCfg: {
    url: '/inventory/api/getmockcfg',
    method: 'POST'
  },
  apiMockCfgUpdate: {
    url: '/inventory/api/updatemockcfg',
    method: 'POST'
  },
  removeApiMockCfg: {
    url: '/inventory/api/removemockcfg',
    method: 'POST'
  }
}

export default InventoryAPI
