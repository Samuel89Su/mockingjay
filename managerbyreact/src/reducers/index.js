import { combineReducers } from 'redux'
import { appList , appCfg } from './app'
import { apiList, apiCfg, apiSchema } from './api'

const managerAPP = combineReducers({
  appCfg, appList, apiList, apiCfg, apiSchema
})

export default managerAPP