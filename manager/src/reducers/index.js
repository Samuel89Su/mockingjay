import { combineReducers } from 'redux'
import { appList , appCfg } from './app'
import { apiList, apiCfg, apiSchema, apiMcCfg } from './api'

export default combineReducers({
  appCfg, appList, apiList, apiCfg, apiSchema, apiMcCfg
})
