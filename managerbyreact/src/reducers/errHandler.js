const errHandler = (state = {}, action) => {
    switch (action.type) {
      case 'ERROR':
        return action.err
      default:
        return state
    }
  }
  
export default errHandler