'use strict'

import { connect } from 'react-redux'
import queryString from 'query-string'
import Loadable from 'react-loadable'
// import ApiExampleV  from './ApiExampleV'
import { fetchRemote } from '../middlewares/remoteFetch'
import InventoryAPI from '../middlewares/InventoryAPI'
import Loading from './Loading'

const ApiExampleV = Loadable({
  loader: () => import('./ApiExampleV'),
  loading: Loading
})

// actions
const updateApiExample = apiExample => {
  return {
      type: 'UPDATE_APIEXAMPLE',
      apiExample
  }
}

// dispatchers
function fetchRemoteApiExample(urlSearch, dispatch) {
  let fetchOpts = Object.assign({}, InventoryAPI.apiExample)
  let payload = JSON.stringify(queryString.parse(urlSearch))
  return fetchRemote(fetchOpts, payload)
  .then(
    apiExample => dispatch(updateApiExample(apiExample)),
    error => console.log(error))
}

function updateRemoteApiSchema(apiExample, dispatch) {
  let api = InventoryAPI.apiExampleUpdate
  let fetchOpts = Object.assign({}, api)
  let payload = JSON.stringify(apiExample)
  return fetchRemote(fetchOpts, payload)
  .then(
    apiExample => dispatch(updateApiExample(apiExample)),
    error => console.log(error))
}

// map state to props
const mapStateToProps = state => {
  let query = queryString.parse(window.location.search)
  delete query.id
  query = queryString.stringify(query)

  return {
    apiExample: (state.apiExample && state.apiExample.hasOwnProperty('query')) ? 
                state.apiExample 
                : {
                    query: {},
                    reqHeader: {},
                    reqBody: '',
                    resHeader: {},
                    resBOdy: ''
                },
    apiCfg: state.apiCfg
  }
}
  
// map dispatch to props
const mapDispatchToProps = dispatch => {
  return {
    onMounted: apiKey => {
      fetchRemoteApiExample(apiKey, dispatch)
    },
    onUpdateClick: apiExample => {
      updateRemoteApiSchema(apiExample, dispatch)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ApiExampleV)