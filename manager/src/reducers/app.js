const pagedApps = (state = [], action) => {
  switch (action.type) {
    case 'UPDATE_APPLIST':
      return action.appList
    default:
      return state
  }
}

const appCfg = (state = {}, action) => {
  switch (action.type) {
    case 'UPDATE_APPCFG':
      return action.appCfg
    default:
      return state
  }
}

export {
  pagedApps,
  appCfg
}
