import { connect } from 'react-redux'
const queryString = require('query-string')
import ApiListV from './ApiListV'
import { fetchRemote } from '../middlewares/remoteFetch'
import InventoryAPI from '../middlewares/InventoryAPI'
import ApiCfgC from './ApiCfgC'
import ApiSchemaC from './ApiSchemaC'
import ApiMcCfgC from './ApiMcCfgC'
import ApiRegisterC from './ApiRegisterC'

// routes
const ApiRoutes = [
    { path: '/api/register', component: ApiRegisterC },
    { path: '/api/details', component: ApiCfgC },
    { path: '/api/schema', component: ApiSchemaC },
    { path: '/api/mockcfg', component: ApiMcCfgC }
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

const ApiListC = connect(mapStateToProps, mapDispatchToProps)(ApiListV)
export { ApiListC, ApiRoutes }