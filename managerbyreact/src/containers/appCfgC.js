import { connect } from 'react-redux'
import appCfgV from '../components/appCfgV'
import { changeSelectedApp } from '../actions'

function changeSelected(appId, dispatch) {
  return dispatch(changeSelectedApp(appId))
}

const mapStateToProps = state => {
  let dummy = null
  if(!state.selectedAppId) {
    dummy = state.appList[0]
  } else {
    for (let i = 0; i < state.appList.length; i++) {
      let appCfg = state.appList[i];
      if (state.selectedAppId === appCfg.id) {
        dummy = appCfg
      }
    }

    if (!dummy) {
      dummy = state.appList[0]
    }
  }

  return {
    appCfg: dummy
  }
}
  
const mapDispatchToProps = dispatch => {
  return {
    onMounted: appId => {
      changeSelected(appId, dispatch)
    },
    onUpdateClick: appCfg => {
      dispatch(changeSelectedApp(appCfg))
    }
  }
}

const appCfgC = connect(mapStateToProps, mapDispatchToProps)(appCfgV)
export default appCfgC;