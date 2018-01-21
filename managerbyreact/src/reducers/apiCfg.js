const apiCfg = (state = {}, action) => {
    switch (action.type) {
      case 'UPDATE_APICFG':
        return action.apiCfg
      default:
        return state
    }
  }
  
  export default apiCfg