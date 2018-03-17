'use strict'

import { connect } from 'react-redux'
import queryString from 'query-string'
import Loadable from 'react-loadable'
import { fetchRemote } from '../middlewares/remoteFetch'
import InventoryAPI from '../middlewares/InventoryAPI'
// import ApiListV from './ApiListV'
import ApiRegisterC from './ApiRegisterC'
import ApiDetailsTab from './ApiDetailsTab'
import Loading from './Loading'

// const ApiRegisterC = Loadable({
//   loader: () => import('./ApiRegisterC'),
//   loading: Loading
// })

// const ApiDetailsTab = Loadable({
//   loader: () => import('./ApiDetailsTab'),
//   loading: Loading
// })

const ApiListV = Loadable({
  loader: () => import('./ApiListV'),
  loading: Loading
})

// routes
const ApiRoutes = [
    { path: '/api/register', component: ApiRegisterC },
    { path: '/api/details', component: ApiDetailsTab }
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