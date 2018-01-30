import { connect } from 'react-redux'
import apiSchemaV  from './apiSchemaV'
import { fetchRemote } from '../middlewares/remoteFetch'
import InventoryAPI from '../middlewares/InventoryAPI'
import queryString from 'query-string'

// actions
const updateApiSchema = apiSchema => {
  return {
      type: 'UPDATE_APISCHEMA',
      apiSchema
  }
}

// dispatchers
function fetchRemoteApiSchema(urlSearch, dispatch) {
  let fetchOpts = Object.assign({}, InventoryAPI.apiSchema)
  let payload = JSON.stringify(queryString.parse(urlSearch))
  return fetchRemote(fetchOpts, payload)
  .then(
    apiSchema => dispatch(updateApiSchema(apiSchema)),
    error => console.log(error))
}

function updateRemoteApiSchema(apiSchema, dispatch) {
  let api = InventoryAPI.apiSchemaUpdate
  let fetchOpts = Object.assign({}, api)
  let payload = JSON.stringify(apiSchema)
  return fetchRemote(fetchOpts, payload)
  .then(
    apiSchema => dispatch(updateApiSchema(apiSchema)),
    error => console.log(error))
}

// map state to props
const mapStateToProps = state => {
  return {
    apiSchema: state.apiSchema,
    apiCfg: state.apiCfg
  }
}
  
// map dispatch to props
const mapDispatchToProps = dispatch => {
  return {
    onMounted: apiKey => {
      fetchRemoteApiSchema(apiKey, dispatch)
    },
    onUpdateClick: apiSchema => {
      updateRemoteApiSchema(apiSchema, dispatch)
    }
  }
}

const apiSchemaC = connect(mapStateToProps, mapDispatchToProps)(apiSchemaV )
export default apiSchemaC;