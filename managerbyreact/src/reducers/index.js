import { combineReducers } from 'redux'
import selectedAppId from './selectedAppId'
import appList from './appList'
import errHandler from './errHandler'
import apiList from './apiList'

const managerAPP = combineReducers({
  selectedAppId, appList, errHandler, apiList
})

export default managerAPP