'use strict'

import { connect } from 'react-redux'
import queryString from 'query-string'
import InventoryAPI from '../middlewares/InventoryAPI'
import { fetchRemote } from '../middlewares/remoteFetch'
import Loadable from '../Components/LoadableComponent'

const UserListLoadable = Loadable(import('../Views/UserLst'))

// actions
const updateAppList = appSharedUsers => {
  appSharedUsers = appSharedUsers || []
  return {
    type: 'UPDATE_APPSHAREDUSERS',
    appSharedUsers
  }
}

// dispatchers
function fetchRemoteAppUsers(dispatch) {
  let query = queryString.parse(location.search)
  let api = InventoryAPI.getappuserlist
  let opts = Object.assign({}, api)
  let postData = JSON.stringify({appId: parseInt(query.appId)})
  return fetchRemote(opts, postData)
  .then(
    users => dispatch(updateAppList(users)),
    error => console.log(error))
}

// map state to props
const mapStateToProps = state => {
  return {
    appId: 0,
    users: state.appSharedUsers || []
  }
}

// map dispatch to props
const mapDispatchToProps = dispatch => {
  return {
    fetchData: () => {
      fetchRemoteAppUsers(dispatch)
    }
  }
}

// connect & export
const UserList = connect(mapStateToProps, mapDispatchToProps)(UserListLoadable)
export default UserList