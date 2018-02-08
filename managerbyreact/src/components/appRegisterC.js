import { connect } from 'react-redux'
import appCfgV from './appCfgV'
import { fetchRemote } from '../middlewares/remoteFetch'
import InventoryAPI from '../middlewares/InventoryAPI'

// actions
const updateAppCfg = appCfg => {
  return {
      type: 'UPDATE_APPCFG',
      appCfg
  }
}

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
  return {
    appCfg: !state.appCfg ? {
              id: 0,
              name: '',
              desc: '',
              apiForwardTarget: '',
              targets: []
            }
            : state.appCfg,
    register: true
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

export default connect(mapStateToProps, mapDispatchToProps)(appCfgV)