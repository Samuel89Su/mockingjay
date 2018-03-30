const proxyCfg = (state = {}, action) => {
  switch (action.type) {
    case 'UPDATE_PROXYCFG':
      return action.proxyCfg
    default:
      return state
  }
}

export {
  proxyCfg
}
