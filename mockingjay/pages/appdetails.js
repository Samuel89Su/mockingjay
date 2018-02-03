'use strict'

import withRedux from "next-redux-wrapper"
import BuildStore from "./BuildStore";
import appCfgV from './components/appCfgV'
import { fetchRemote } from './middlewares/remoteFetch'
import InventoryAPI from './middlewares/InventoryAPI'

// actions
const updateAppCfg = appCfg => {
  return {
      type: 'UPDATE_APPCFG',
      appCfg
  }
}

// dispatchers
function fetchRemoteAppCfg(appId, dispatch) {
  let fetchOpts = Object.assign({}, InventoryAPI.appGet)
  fetchOpts.url += appId
  return fetchRemote(fetchOpts)
  .then(
    appCfg => dispatch(updateAppCfg(appCfg)),
    error => console.log(error))
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

function discardRemoteAppCfg(appCfg, dispatch) {
  let api = InventoryAPI.appDiscard
  let fetchOpts = Object.assign({}, api)
  let payload = JSON.stringify(appCfg)
  return fetchRemote(fetchOpts, payload)
  .then(
    appCfg => dispatch(updateAppCfg(appCfg)),
    error => console.log(error))
}

// map state to props
const mapStateToProps = (state) => {
  return {
    appCfg: !state ? null : state.appCfg
  }
}
  
// map dispatch to props
const mapDispatchToProps = dispatch => {
  return {
    onMounted: appId => {
      fetchRemoteAppCfg(appId, dispatch)
    },
    onUpdateClick: appCfg => {
      updateRemoteAppCfg(appCfg, dispatch)
    },
    onDiscardClick: appCfg => {
      discardRemoteAppCfg(appCfg, dispatch)
    }
  }
}

export default withRedux(BuildStore, mapStateToProps, mapDispatchToProps)(appCfgV)