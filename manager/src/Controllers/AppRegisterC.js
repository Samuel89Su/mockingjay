'use strict'

import { connect } from 'react-redux'
import Loadable from 'react-loadable'
// import AppCfgV from './AppCfgV'
import { fetchRemote } from '../middlewares/remoteFetch'
import InventoryAPI from '../middlewares/InventoryAPI'
import Loading from '../Views/Loading'

const AppCfgV = Loadable({
  loader: () => import('../Views/AppCfgV'),
  loading: Loading
})

// actions
const updateAppCfg = appCfg => {
  return {
      type: 'UPDATE_APPCFG',
      appCfg
  }
}

// dispatchers
function updateRemoteAppCfg(appCfg, dispatch) {
  let api = !appCfg.id ? InventoryAPI.appRegister : InventoryAPI.appUpdate
  let fetchOpts = Object.assign({}, api)
  let payload = JSON.stringify(appCfg)
  return fetchRemote(fetchOpts, payload)
  .then(
    appCfg => dispatch(updateAppCfg(appCfg)),
    error => console.log(error))
}

// map state to props
const mapStateToProps = state => {
  let appCfg = {
    id: 0,
    name: '',
    desc: '',
    apiForwardTarget: '',
    targets: []
  }
  if (state.appCfg && state.appCfg.id && state.appCfg.id > 0) {
    appCfg = state.appCfg
  }
  return {
    appCfg: appCfg,
    register: appCfg.id === 0
  }
}
  
// map dispatch to props
const mapDispatchToProps = dispatch => {
  return {
    onUpdateClick: appCfg => {
      updateRemoteAppCfg(appCfg, dispatch)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppCfgV)