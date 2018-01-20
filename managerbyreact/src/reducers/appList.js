const appList = (state = [], action) => {
    switch (action.type) {
      case 'UPDATE_APPLIST':
        return action.appList
      default:
        return state
    }
  }
  
export default appList