'use strict'

import { connect } from 'react-redux'
import queryString from 'query-string'
import InventoryAPI from '../middlewares/InventoryAPI'
import { fetchRemote } from '../middlewares/remoteFetch'
import Loadable from '../Components/LoadableComponent'

const AppListV = Loadable(import('../Views/AppList'))

// actions
const updateAppList = pagedApps => {
  pagedApps = pagedApps || []
  return {
    type: 'UPDATE_APPLIST',
    pagedApps
  }
}

// dispatchers
function fetchRemoteAppList(dispatch, query) {
  let api = query.owned ? InventoryAPI.appList : InventoryAPI.sharedAppList
  let opts = Object.assign({}, api)
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
export default AppListC