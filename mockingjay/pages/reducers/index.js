import { combineReducers } from 'redux'
import { appList , appCfg } from './app'
import { apiList, apiCfg, apiSchema, apiMcCfg } from './api'
import foo from './foo'

const reducer = combineReducers({
  foo, appCfg, appList, apiList, apiCfg, apiSchema, apiMcCfg
})

export default reducer