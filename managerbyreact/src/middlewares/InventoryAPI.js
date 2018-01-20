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
  apiRegister: {
    url: '/inventory/api/register',
    method: 'POST'
  },
  apiUpdate: {
    url: '/inventory/api/update',
    method: 'POST'
  },
  apiSchema: {
    url: '/inventory/api/getApiSchema',
    method: 'POST'
  },
  apiSchemaUpdate: {
    url: '/inventory/api/updateSchema',
    method: 'POST'
  },
  apiMockCfg: {
    url: '/inventory/api/getApiConfig',
    method: 'POST'
  },
  apiMockCfgUpdate: {
    url: '/inventory/api/updateConfig',
    method: 'POST'
  }
}

export default InventoryAPI
