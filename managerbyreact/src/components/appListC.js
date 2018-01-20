import { connect } from 'react-redux'
import appListV from './appListV'
import { apiListC, ApiRoutes } from './apiListC'
import InventoryAPI from '../middlewares/InventoryAPI'
import { fetchRemote } from '../middlewares/remoteFetch'
import appCfgC from './appCfgC'

// routes
const AppRoutes = [
  ...ApiRoutes,
  { path: '/app/register' },
  { path: '/app/details', component: appCfgC },
  { path: '/app/apilist', component: apiListC }
]

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
const appListC = connect(mapStateToProps, mapDispatchToProps)(appListV)
export { appListC, AppRoutes };