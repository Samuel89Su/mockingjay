import { connect } from 'react-redux'
import ApiCfgV from './ApiCfgV'
import { fetchRemote } from '../middlewares/remoteFetch'
import InventoryAPI from '../middlewares/InventoryAPI'

// actions
const updateApiCfg = apiCfg => {
  return {
    type: 'UPDATE_APICFG',
    apiCfg
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

function updateRemoteApiCfg(apiCfg, dispatch) {
  let api = !apiCfg.id ? InventoryAPI.apiRegister : InventoryAPI.apiUpdate
  let fetchOpts = Object.assign({}, api)
  let payload = JSON.stringify(apiCfg)
  return fetchRemote(fetchOpts, payload)
    .then(
      apiCfg => dispatch(updateApiCfg(apiCfg)),
      error => (error) => {})
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
  return {
    apiCfg: state.apiCfg,
    register: false
  }
}

// map dispatch to props
const mapDispatchToProps = dispatch => {
  return {
    onMounted: apiKey => {
      fetchRemoteApiCfg(apiKey, dispatch)
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
