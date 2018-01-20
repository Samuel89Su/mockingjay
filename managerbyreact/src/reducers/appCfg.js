const appCfg = (state = {}, action) => {
    switch (action.type) {
      case 'UPDATE_APPCFG':
        return action.appCfg
      default:
        return state
    }
  }
  
  export default appCfg