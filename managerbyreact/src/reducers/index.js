import { combineReducers } from 'redux'
import appCfg from './appCfg'
import appList from './appList'
import apiList from './apiList'

const managerAPP = combineReducers({
  appCfg, appList, apiList
})

export default managerAPP