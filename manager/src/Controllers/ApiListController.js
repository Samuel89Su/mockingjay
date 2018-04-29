'use strict'

import { connect } from 'react-redux'
import queryString from 'query-string'
import { fetchRemote } from '../middlewares/remoteFetch'
import InventoryAPI from '../middlewares/InventoryAPI'
import Loadable from '../Components/LoadableComponent'

const ApiListV = Loadable(import('../Views/ApiList'))

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
export default ApiListC