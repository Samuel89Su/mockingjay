
const updateAppList = appList => {
  return {
    type: 'UPDATE_APPLIST',
    appList
  }
}

function updateApiList(apiList) {
  return {
    type: 'UPDATE_APILIST',
    apiList
  }
}

const changeSelectedApp = selectedAppId => {
    return {
        type: 'CHG_SELECTED_APPID',
        selectedAppId
    }
}

function handleErr(err) {
  return {
    type: 'ERROR',
    err
  }
}

export { updateAppList, updateApiList, changeSelectedApp, handleErr }