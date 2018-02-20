import { connect } from 'react-redux'
import ApiCfgV from './ApiCfgV'
import { fetchRemote } from '../middlewares/remoteFetch'
import InventoryAPI from '../middlewares/InventoryAPI'

// actions
const updateApiCfg = apiCfg => {
  return {
    type: 'UPDATE_APICFG',
    apiCfg
  }
}

// dispatchers
function updateRemoteApiCfg(apiCfg, dispatch) {
  let api = !apiCfg.id ? InventoryAPI.apiRegister : InventoryAPI.apiUpdate
  let fetchOpts = Object.assign({}, api)
  let payload = JSON.stringify(apiCfg)
  return fetchRemote(fetchOpts, payload)
    .then(
      apiCfg => dispatch(updateApiCfg(apiCfg)),
      error => console.log(error))
}

// map state to props
const mapStateToProps = state => {
  return {
    apiCfg: (!state.apiCfg || !state.apiCfg.name)
        ? {
            name: '',
            description: '',
            path: '/',
            method: 'POST',
            appId: 1,
            forward:  false
          }
        : state.apiCfg,
    register: true
  }
}

// map dispatch to props
const mapDispatchToProps = dispatch => {
  return {
    onUpdateClick: apiCfg => {
      updateRemoteApiCfg(apiCfg, dispatch)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ApiCfgV);
