const contentTypeHeader = { 'Content-Type': 'application/json' }

const InventoryAPI = {
  appRegister: {
    url: '/inventory/app/register',
    method: 'POST',
    headers: contentTypeHeader
  },
  appUpdate: {
    url: '/inventory/app/update',
    method: 'POST',
    headers: contentTypeHeader
  },
  appDiscard: {
    url: '/inventory/app/discard',
    method: 'POST',
    headers: contentTypeHeader
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
    method: 'POST',
    headers: contentTypeHeader
  },
  apiUpdate: {
    url: '/inventory/api/update',
    method: 'POST',
    headers: contentTypeHeader
  },
  apiDiscard: {
    url: '/inventory/api/discard',
    method: 'POST',
    headers: contentTypeHeader
  },
  addMockCfg: {
    url: '/inventory/api/mockcfg',
    method: 'POST',
    headers: contentTypeHeader
  },
  apiSchema: {
    url: '/inventory/api/getapischema',
    method: 'POST',
    headers: contentTypeHeader
  },
  apiSchemaUpdate: {
    url: '/inventory/api/updateschema',
    method: 'POST',
    headers: contentTypeHeader
  },
  apiMockCfg: {
    url: '/inventory/api/getmockcfg',
    method: 'POST',
    headers: contentTypeHeader
  },
  apiMockCfgUpdate: {
    url: '/inventory/api/updatemockcfg',
    method: 'POST',
    headers: contentTypeHeader
  },
  removeApiMockCfg: {
    url: '/inventory/api/removemockcfg',
    method: 'POST',
    headers: contentTypeHeader
  },
  apiExample: {
    url: '/inventory/api/getexample',
    method: 'POST',
    headers: contentTypeHeader
  },
  apiExampleUpdate: {
    url: '/inventory/api/updateexample',
    method: 'POST',
    headers: contentTypeHeader
  }
}

export default InventoryAPI
