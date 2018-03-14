'use strict'

import { connect } from 'react-redux'
import queryString from 'query-string'
import Loadable from 'react-loadable'
import InventoryAPI from '../middlewares/InventoryAPI'
import { fetchRemote } from '../middlewares/remoteFetch'
import { ApiRoutes } from './ApiListC'
import AppListV from './AppListV'
// import { ApiListC } from './ApiListC'
// import AppCfgC from './AppCfgC'
// import AppRegisterC from './AppRegisterC'
import Loading from './Loading'

const AppRegister = Loadable({
  loader: () => import('./AppRegisterC'),
  loading: Loading
})

const AppCfg = Loadable({
  loader: () => import('./AppCfgC'),
  loading: Loading
})

const ApiList = Loadable({
  loader: () => import('./ApiListC').ApiListC,
  loading: Loading
})

// routes
const AppRoutes = [
  ...ApiRoutes,
  { path: '/app/register', component: AppRegister },
  { path: '/app/details', component: AppCfg },
  { path: '/app/apilist', component: ApiList }
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