import { connect } from 'react-redux'
import appListV from '../components/appListV'
import { apiListC, ApiRoutes } from './apiListC'
import InventoryAPI from '../middlewares/InventoryAPI'
import { fetchRemote } from '../middlewares/remoteFetch'
import { updateAppList } from '../actions'
import appCfgC from './appCfgC'

const AppRoutes = [
  ...ApiRoutes,
  { path: '/app/register' },
  { path: '/app/details', component: appCfgC },
  { path: '/app/apilist', component: apiListC }
]

function fetchRemoteAppList(dispatch) {
  return fetchRemote(InventoryAPI.appList)(dispatch)
  .then(
    appList => dispatch(updateAppList(appList)),
    error => console.log(error))
}

const mapStateToProps = state => {
  return {
    appList: state.appList
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onMounted: () => {
      fetchRemoteAppList(dispatch)
    }
  }
}

const appListC = connect(mapStateToProps, mapDispatchToProps)(appListV)
export { appListC, AppRoutes };