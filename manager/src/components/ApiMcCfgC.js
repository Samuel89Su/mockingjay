import { connect } from 'react-redux'
import ApiMcCfgV from './ApiMcCfgV'
import { fetchRemote } from '../middlewares/remoteFetch'
import InventoryAPI from '../middlewares/InventoryAPI'
import queryString from 'query-string'

// actions
const updateApiMcCfg = apiMcCfg => {
  apiMcCfg = apiMcCfg ? apiMcCfg : {}
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
      mockCfg => dispatch(updateApiMcCfg(mockCfg)),
      error => console.log(error))
}

function updateRemoteApiMcCfg(mockCfg, dispatch) {
  let api = InventoryAPI.apiMockCfgUpdate
  let fetchOpts = Object.assign({}, api)
  let payload = JSON.stringify(mockCfg)
  return fetchRemote(fetchOpts, payload)
    .then(
      McCfg => dispatch(updateApiMcCfg(McCfg)),
      error => console.log(error))
}

// map state to props
const mapStateToProps = state => {
  let mockCfg = {
    appId: state.apiCfg.appId,
    id: state.apiCfg.id,
    path: state.apiCfg.path,
    mock: false,
    validateReq: false,
    resDescriptor: {
      headers: [],
      body: {
        optional: true,
        reactor: {
          type: 'fixed',
          value: ''
        }
      }
    }
  }
  if (state.apiMcCfg) {
    mockCfg = state.apiMcCfg
    mockCfg.appId = state.apiCfg.appId
    mockCfg.path = state.apiCfg.path
  }

  return {
    mockCfg: mockCfg
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

export default connect(mapStateToProps, mapDispatchToProps)(ApiMcCfgV)
