import { connect } from 'react-redux'
import apiCfgV from '../components/apiCfgV'
import {
  fetchRemote,
  fakeDiscard
} from '../components/remoteFetch'
import InventoryAPI from '../components/InventoryAPI'

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
      error => console.log(error))
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
  return fakeDiscard(fetchOpts, payload)
    .then(
      apiCfg => {
        history.goBack()
      },
      error => console.log(error))
}

// map state to props
const mapStateToProps = state => {
  return {
    apiCfg: state.apiCfg
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
