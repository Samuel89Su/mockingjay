import { connect } from 'react-redux'
import AppListV from './AppListV'
import InventoryAPI from '../middlewares/InventoryAPI'
import { fetchRemote } from '../middlewares/remoteFetch'

// actions
const updateAppList = appList => {
  return {
    type: 'UPDATE_APPLIST',
    appList
  }
}

// dispatchers
function fetchRemoteAppList(dispatch) {
  return fetchRemote(InventoryAPI.appList)
  .then(
    appList => dispatch(updateAppList(appList)),
    error => console.log(error))
}

// map state to props
const mapStateToProps = state => {
  return {
    appList: state.appList
  }
}

// map dispatch to props
const mapDispatchToProps = dispatch => {
  return {
    onMounted: () => {
      fetchRemoteAppList(dispatch)
    }
  }
}

// connect & export
export default connect(mapStateToProps, mapDispatchToProps)(AppListV)

