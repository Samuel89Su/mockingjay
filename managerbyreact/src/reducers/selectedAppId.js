const selectedAppId = (state = 0, action) => {
    switch (action.type) {
      case 'CHG_SELECTED_APPID':
        return action.selectedAppId
      default:
        return state
    }
  }
  
  export default selectedAppId