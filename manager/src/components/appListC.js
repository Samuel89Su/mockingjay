import { connect } from 'react-redux'
const queryString = require('query-string')
import appListV from './appListV'
import { apiListC, ApiRoutes } from './apiListC'
import InventoryAPI from '../middlewares/InventoryAPI'
import { fetchRemote } from '../middlewares/remoteFetch'
import appCfgC from './appCfgC'
import appRegisterC from './appRegisterC'

// routes
const AppRoutes = [
  ...ApiRoutes,
  { path: '/app/register', component: appRegisterC },
  { path: '/app/details', component: appCfgC },
  { path: '/app/apilist', component: apiListC }
]

// actions
const updateAppList = appList => {
  return {
    type: 'UPDATE_APPLIST',
    appList
  }
}

// dispatchers
function fetchRemoteAppList(dispatch, query) {
  let opts = Object.assign({}, InventoryAPI.appList)
  opts.url = opts.url + '?' + queryString.stringify(query)
  return fetchRemote(opts)
  .then(
    pagedApps => dispatch(updateAppList(pagedApps)),
    error => console.log(error))
}

// map state to props
const mapStateToProps = state => {
  return {
    pagedApps: state.pagedApps
  }
}

// map dispatch to props
const mapDispatchToProps = dispatch => {
  return {
    fetchData: (query) => {
      fetchRemoteAppList(dispatch, query)
    }
  }
}

// connect & export
const appListC = connect(mapStateToProps, mapDispatchToProps)(appListV)
export { appListC, AppRoutes };