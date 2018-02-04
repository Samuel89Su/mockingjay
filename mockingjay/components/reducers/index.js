import { combineReducers } from 'redux'
import { appList , appCfg } from './app'
import { apiList, apiCfg, apiSchema, apiMcCfg } from './api'

const reducer = combineReducers({
  appCfg, appList, apiList, apiCfg, apiSchema, apiMcCfg
})

export default reducer