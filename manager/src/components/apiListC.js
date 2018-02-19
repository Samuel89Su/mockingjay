import { connect } from 'react-redux'
const queryString = require('query-string')
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
function updateApiList(pagedApis) {
  return {
    type: 'UPDATE_APILIST',
    pagedApis
  }
}

// dispatchers
function fetchRemoteApiList(dispatch, query) {
  let fetchOpts = Object.assign({}, InventoryAPI.apiList)
  fetchOpts.url += '?' + queryString.stringify(query)
  return fetchRemote(fetchOpts)
  .then(
    pagedApis => dispatch(updateApiList(pagedApis)),
    error => console.log(error))
}

// map state to props
const mapStateToProps = state => {
  return {
    pagedApis: state.pagedApis
  }
}

// map dispatch to props
const mapDispatchToProps = dispatch => {
  return {
    fetchData: (query) => {
      fetchRemoteApiList(dispatch, query)
    }
  }
}

const apiListC = connect(mapStateToProps, mapDispatchToProps)(apiListV)
export { apiListC, ApiRoutes };