'use strict'

import { connect } from 'react-redux'
import queryString from 'query-string'
import Loadable from 'react-loadable'
import InventoryAPI from '../middlewares/InventoryAPI'
import { fetchRemote } from '../middlewares/remoteFetch'
import { ApiRoutes } from './ApiListC'
// import AppListV from './AppListV'
import { ApiListC } from './ApiListC'
import AppCfgC from './AppCfgC'
import AppRegisterC from './AppRegisterC'
import Loading from './Loading'

// const AppRegisterC = Loadable({
//   loader: () => import('./AppRegisterC'),
//   loading: Loading
// })

// const AppCfgC = Loadable({
//   loader: () => import('./AppCfgC'),
//   loading: Loading
// })

// const ApiListC = Loadable({
//   loader: () => import('./ApiListC').ApiListC,
//   loading: Loading
// })

const AppListV = Loadable({
  loader: () => import('./AppListV'),
  loading: Loading
})

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