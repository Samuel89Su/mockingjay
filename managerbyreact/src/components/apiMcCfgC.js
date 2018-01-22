import { connect } from 'react-redux'
import apiMcCfgV  from './apiMcCfgV'
import { fetchRemote } from '../middlewares/remoteFetch'
import InventoryAPI from '../middlewares/InventoryAPI'
import queryString from 'query-string'

// actions
const updateApiMcCfg = apiMcCfg => {
  return {
      type: 'UPDATE_APIMCCFG',
      apiMcCfg
  }
}

// dispatchers
function fetchRemoteApiMcCfg(urlSearch, dispatch) {
  let fetchOpts = Object.assign({}, InventoryAPI.apiMockCfg)
  let payload = JSON.stringify(queryString.parse(urlSearch))
  return fetchRemote(fetchOpts, payload)
  .then(
    apiMcCfg => dispatch(updateApiMcCfg(apiMcCfg)),
    error => console.log(error))
}

function updateRemoteApiMcCfg(apiMcCfg, dispatch) {
  let api = InventoryAPI.apiMockCfgUpdate
  let fetchOpts = Object.assign({}, api)
  let payload = JSON.stringify(apiMcCfg)
  return fetchRemote(fetchOpts, payload)
  .then(
    McCfg => dispatch(updateApiMcCfg(McCfg)),
    error => console.log(error))
}

// map state to props
const mapStateToProps = state => {
  return {
    apiMcCfg: state.apiMcCfg,
    apiCfg: state.apiCfg
  }
}
  
// map dispatch to props
const mapDispatchToProps = dispatch => {
  return {
    onMounted: apiKey => {
      fetchRemoteApiMcCfg(apiKey, dispatch)
    },
    onUpdateClick: apiSchema => {
      updateRemoteApiMcCfg(apiSchema, dispatch)
    }
  }
}

const apiMcCfgC = connect(mapStateToProps, mapDispatchToProps)(apiMcCfgV )
export default apiMcCfgC;