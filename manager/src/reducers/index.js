import { combineReducers } from 'redux'
import { pagedApps , appCfg } from './app'
import { pagedApis, apiCfg, apiSchema, apiMcCfg } from './api'

export default combineReducers({
  appCfg, pagedApps, pagedApis, apiCfg, apiSchema, apiMcCfg
})
