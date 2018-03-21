'use strict'

import { connect } from 'react-redux'
import Loadable from 'react-loadable'
// import ApiCfgV from './ApiCfgV'
import { fetchRemote } from '../middlewares/remoteFetch'
import InventoryAPI from '../middlewares/InventoryAPI'
import Loading from './Loading'

const ApiCfgV = Loadable({
  loader: () => import('./ApiCfgV'),
  loading: Loading
})

// actions
const updateApiCfg = apiCfg => {
  return {
    type: 'UPDATE_APICFG',
    apiCfg
  }
}

const updateAppCfg = appCfg => {
  return {
      type: 'UPDATE_APPCFG',
      appCfg
  }
}

// dispatchers
function fetchRemoteApiCfg(urlSearch, dispatch) {
  let fetchOpts = Object.assign({}, InventoryAPI.apiGet)
  fetchOpts.url += urlSearch
  return fetchRemote(fetchOpts)
    .then(
      apiCfg => dispatch(updateApiCfg(apiCfg)),
      error => (error) => {})
}

function fetchRemoteAppCfg(urlSearch, dispatch) {
  let fetchOpts = Object.assign({}, InventoryAPI.appGet)
  fetchOpts.url += urlSearch
  return fetchRemote(fetchOpts)
  .then(
    appCfg => dispatch(updateAppCfg(appCfg)),
    error => (error) => {})
}

function updateRemoteApiCfg(apiCfg, dispatch) {
  let api = !apiCfg.id ? InventoryAPI.apiRegister : InventoryAPI.apiUpdate
  let fetchOpts = Object.assign({}, api)
  let payload = JSON.stringify(apiCfg)
  return fetchRemote(fetchOpts, payload)
    .then(
      apiCfg => dispatch(updateApiCfg(apiCfg)),
      error => console.log(error))
}

function discardRemoteAppCfg(apiCfg, history) {
  let api = InventoryAPI.apiDiscard
  let fetchOpts = Object.assign({}, api)
  let payload = JSON.stringify(apiCfg)
  return fetchRemote(fetchOpts, payload)
    .then(
      () => {
        history.back()
      },
      error => (error) => {})
}

// map state to props
const mapStateToProps = state => {
  let apiCfg = {
    'id': 0,
    name: '',
    description: '',
    path: '/',
    method: 'POST',
    appId: 1,
    forward:  false,
    validate: false
  }
  if (state.apiCfg && state.apiCfg.id && state.apiCfg.id > 0) {
    apiCfg = state.apiCfg
  }
  return {
    apiCfg: apiCfg,
    register: apiCfg.id === 0
  }
}

// map dispatch to props
const mapDispatchToProps = dispatch => {
  return {
    onMounted: apiKey => {
      fetchRemoteApiCfg(apiKey, dispatch)
    },
    fetchApp: query => {
      fetchRemoteAppCfg(query, dispatch)
    },
    onUpdateClick: apiCfg => {
      updateRemoteApiCfg(apiCfg, dispatch)
    },
    onDiscardClick: (apiCfg, history) => {
      discardRemoteAppCfg(apiCfg, history)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ApiCfgV)
