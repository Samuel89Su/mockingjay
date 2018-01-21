import { combineReducers } from 'redux'
import appCfg from './appCfg'
import appList from './appList'
import apiList from './apiList'
import apiCfg from './apiCfg'

const managerAPP = combineReducers({
  appCfg, appList, apiList, apiCfg
})

export default managerAPP