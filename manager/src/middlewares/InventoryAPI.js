const headers = { headers: { 'Content-Type': 'application/json' } }

const commonOpts = {
  credentials: 'include'
}

const InventoryAPI = {
  appRegister: {
    url: '/inventory/app/register',
    method: 'POST',
    ...headers,
    ...commonOpts
  },
  appUpdate: {
    url: '/inventory/app/update',
    method: 'POST',
    ...headers,
    ...commonOpts
  },
  appDiscard: {
    url: '/inventory/app/discard',
    method: 'POST',
    ...headers,
    ...commonOpts
  },
  appList: {
    url: '/inventory/app/list',
    method: 'GET',
    ...commonOpts
  },
  appGet: {
    url: '/inventory/app/get',
    method: 'GET',
    ...commonOpts
  },
  apiList: {
    url: '/inventory/api/list',
    method: 'GET',
    ...commonOpts
  },
  apiGet: {
    url: '/inventory/api/get',
    method: 'GET',
    ...commonOpts
  },
  apiRegister: {
    url: '/inventory/api/register',
    method: 'POST',
    ...headers,
    ...commonOpts
  },
  apiUpdate: {
    url: '/inventory/api/update',
    method: 'POST',
    ...headers,
    ...commonOpts
  },
  apiDiscard: {
    url: '/inventory/api/discard',
    method: 'POST',
    ...headers,
    ...commonOpts
  },
  apiSchema: {
    url: '/inventory/api/getapischema',
    method: 'POST',
    ...headers,
    ...commonOpts
  },
  apiSchemaUpdate: {
    url: '/inventory/api/updateschema',
    method: 'POST',
    ...headers,
    ...commonOpts
  },
  apiMockCfg: {
    url: '/inventory/api/getmockcfg',
    method: 'POST',
    ...headers,
    ...commonOpts
  },
  apiMockCfgUpdate: {
    url: '/inventory/api/updatemockcfg',
    method: 'POST',
    ...headers,
    ...commonOpts
  },
  removeApiMockCfg: {
    url: '/inventory/api/removemockcfg',
    method: 'POST',
    ...headers,
    ...commonOpts
  },
  apiExample: {
    url: '/inventory/api/getexample',
    method: 'POST',
    ...headers,
    ...commonOpts
  },
  apiExampleUpdate: {
    url: '/inventory/api/updateexample',
    method: 'POST',
    ...headers,
    ...commonOpts
  },
  login: {
    url: '/inventory/login',
    method: 'POST',
    ...headers,
    ...commonOpts
  },
  logout: {
    url: '/inventory/logout',
    method: 'POST',
    ...headers,
    ...commonOpts
  },
  signup: {
    url: '/inventory/signup',
    method: 'POST',
    ...headers
  }
}

export default InventoryAPI
