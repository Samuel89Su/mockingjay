import { connect } from 'react-redux'
import apiListV from './apiListV'
import { fetchRemote } from '../middlewares/remoteFetch'
import InventoryAPI from '../middlewares/InventoryAPI'
import apiCfgC from './apiCfgC'
import apiSchemaC from './apiSchemaC'
import apiMcCfgC from './apiMcCfgC'
import apiRegisterC from './apiRegisterC'

// routes
const ApiRoutes = [
    { path: '/api/register', component: apiRegisterC },
    { path: '/api/details', component: apiCfgC },
    { path: '/api/schema', component: apiSchemaC },
    { path: '/api/mockcfg', component: apiMcCfgC }
]

// actions
function updateApiList(apiList) {
  return {
    type: 'UPDATE_APILIST',
    apiList
  }
}

// dispatchers
function fetchRemoteApiList(urlSearch, dispatch) {
  let fetchOpts = Object.assign({}, InventoryAPI.apiList)
  fetchOpts.url += urlSearch
  return fetchRemote(fetchOpts)
  .then(
    apiList => dispatch(updateApiList(apiList)),
    error => console.log(error))
}

// map state to props
const mapStateToProps = state => {
  return {
    apiList: state.apiList,
    appName: state.appCfg.name
  }
}

// map dispatch to props
const mapDispatchToProps = dispatch => {
  return {
    onMounted: (urlSearch) => {
      fetchRemoteApiList(urlSearch, dispatch)
    }
  }
}

const apiListC = connect(mapStateToProps, mapDispatchToProps)(apiListV)
export { apiListC, ApiRoutes };