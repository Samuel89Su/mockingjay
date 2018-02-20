import { connect } from 'react-redux'
import queryString from 'query-string'
import apiCfgV from './apiCfgV'
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
  let query = queryString.parse(window.location.search)
  delete query.id
  query = queryString.stringify(query)

  return {
    apiCfg: state.apiCfg,
    register: false,
    appQuery: query
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

const apiCfgC = connect(mapStateToProps, mapDispatchToProps)(apiCfgV)
export default apiCfgC;
