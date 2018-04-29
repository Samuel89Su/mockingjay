import { combineReducers } from 'redux'
import { pagedApps , appCfg, appSharedUsers } from './app'
import { pagedApis, apiCfg, apiSchema, apiMcCfg, apiExample } from './api'

export default combineReducers({
  appCfg, pagedApps, pagedApis, apiCfg, apiSchema, apiMcCfg, apiExample, appSharedUsers
})
