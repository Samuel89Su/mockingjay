import { combineReducers } from 'redux'
import { pagedApps , appCfg } from './app'
import { apiList, apiCfg, apiSchema, apiMcCfg } from './api'

export default combineReducers({
  appCfg, pagedApps, apiList, apiCfg, apiSchema, apiMcCfg
})
