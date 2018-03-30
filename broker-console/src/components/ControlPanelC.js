'use strict'

import { connect } from 'react-redux'
import { fetchRemote } from '../middlewares/remoteFetch'
import InventoryAPI from '../middlewares/InventoryAPI'
import ControlPanel from './ControlPanel'

// actions
const updateProxyCfg = cfg => {
  return {
      type: 'UPDATE_PROXYCFG',
      cfg
  }
}

// dispatchers
function updateRemoteProxyCfg(proxyCfg, dispatch) {
  let fetchOpts = Object.assign({}, InventoryAPI.updateProxyCfg)
  let payload = JSON.stringify(proxyCfg)
  return fetchRemote(fetchOpts, payload)
  .then(
    appCfg => dispatch(updateProxyCfg(appCfg)),
    error => console.log(error))
}

// map state to props
const mapStateToProps = state => {
  let proxyCfg = {}
  if (state.proxyCfg) {
    proxyCfg = state.proxyCfg
  }
  return {
    // proxyCfg: proxyCfg
  }
}
  
// map dispatch to props
const mapDispatchToProps = dispatch => {
  return {
    // onUpdateClick: proxyCfg => {
    //   updateRemoteProxyCfg(proxyCfg, dispatch)
    // }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ControlPanel)