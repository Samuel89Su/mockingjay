import { connect } from 'react-redux'
import apiListV from '../components/apiListV'
import { fetchRemote } from '../components/remoteFetch'
import InventoryAPI from '../components/InventoryAPI'

// routes
const ApiRoutes = [
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
    apiList: state.apiList
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