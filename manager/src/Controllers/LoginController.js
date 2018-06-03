'use strict'

import { connect } from 'react-redux'
import queryString from 'query-string'
import InventoryAPI from '../middlewares/InventoryAPI'
import { fetchRemote } from '../middlewares/remoteFetch'
import Loadable from '../Components/LoadableComponent'

const LoginV = Loadable(import('../Views/Login'))

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
  }
}

// map dispatch to props
const mapDispatchToProps = dispatch => {
  return {
  }
}

// connect & export
const LoginC = connect(mapStateToProps, mapDispatchToProps)(LoginV)
export default LoginC