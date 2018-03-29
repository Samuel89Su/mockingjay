const pagedApis = (state = {}, action) => {
  switch (action.type) {
    case 'UPDATE_APILIST':
      return action.pagedApis
    default:
      return state
  }
}

const apiCfg = (state = {}, action) => {
  switch (action.type) {
    case 'UPDATE_APICFG':
      return action.apiCfg
    default:
      return state
  }
}

const apiSchema = (state = {}, action) => {
  switch (action.type) {
    case 'UPDATE_APISCHEMA':
      return action.apiSchema
    default:
      return state
  }
}

const apiMcCfg = (state = {}, action) => {
  switch (action.type) {
    case 'UPDATE_APIMCCFG':
      return action.apiMcCfg
    default:
      return state
  }
}

const apiExample = (state = {}, action) => {
  switch (action.type) {
    case 'UPDATE_APIEXAMPLE':
      return action.apiExample
    default:
      return state
  }
}

export {
  pagedApis,
  apiCfg,
  apiSchema,
  apiMcCfg,
  apiExample
}
