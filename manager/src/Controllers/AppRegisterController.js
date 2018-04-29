'use strict'

import { connect } from 'react-redux'
import { fetchRemote } from '../middlewares/remoteFetch'
import InventoryAPI from '../middlewares/InventoryAPI'
import Loadable from '../Components/LoadableComponent'

const AppCfgV = Loadable(import('../Views/AppCfg'))

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
    appCfg: appCfg
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