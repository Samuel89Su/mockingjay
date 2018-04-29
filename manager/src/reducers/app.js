const pagedApps = (state = {}, action) => {
  switch (action.type) {
    case 'UPDATE_APPLIST':
      return action.pagedApps
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

const appSharedUsers = (state=[], action) => {
  switch (action.type) {
    case 'UPDATE_APPSHAREDUSERS':
      return action.appSharedUsers
    default:
      return state
  }
}

export {
  pagedApps,
  appCfg,
  appSharedUsers
}
