import { connect } from 'react-redux'
const queryString = require('query-string')
import AppListV from './AppListV'
import { ApiListC, ApiRoutes } from './ApiListC'
import InventoryAPI from '../middlewares/InventoryAPI'
import { fetchRemote } from '../middlewares/remoteFetch'
import AppCfgC from './AppCfgC'
import AppRegisterC from './AppRegisterC'

// routes
const AppRoutes = [
  ...ApiRoutes,
  { path: '/app/register', component: AppRegisterC },
  { path: '/app/details', component: AppCfgC },
  { path: '/app/apilist', component: ApiListC }
]

// actions
const updateAppList = pagedApps => {
  return {
    type: 'UPDATE_APPLIST',
    pagedApps
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
const AppListC = connect(mapStateToProps, mapDispatchToProps)(AppListV)
export { AppListC, AppRoutes }