const apiList = (state = [], action) => {
    switch (action.type) {
      case 'UPDATE_APILIST':
        return action.apiList
      default:
        return state
    }
  }
  
export default apiList