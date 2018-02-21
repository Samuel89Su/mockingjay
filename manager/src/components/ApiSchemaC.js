import { connect } from 'react-redux'
import ApiSchemaV  from './ApiSchemaV'
import { fetchRemote } from '../middlewares/remoteFetch'
import InventoryAPI from '../middlewares/InventoryAPI'
import queryString from 'query-string'

// actions
const updateApiSchema = apiSchema => {
  return {
      type: 'UPDATE_APISCHEMA',
      apiSchema
  }
}

// dispatchers
function fetchRemoteApiSchema(urlSearch, dispatch) {
  let fetchOpts = Object.assign({}, InventoryAPI.apiSchema)
  let payload = JSON.stringify(queryString.parse(urlSearch))
  return fetchRemote(fetchOpts, payload)
  .then(
    apiSchema => dispatch(updateApiSchema(apiSchema)),
    error => console.log(error))
}

function updateRemoteApiSchema(apiSchema, dispatch) {
  let api = InventoryAPI.apiSchemaUpdate
  let fetchOpts = Object.assign({}, api)
  let payload = JSON.stringify(apiSchema)
  return fetchRemote(fetchOpts, payload)
  .then(
    apiSchema => dispatch(updateApiSchema(apiSchema)),
    error => console.log(error))
}

// map state to props
const mapStateToProps = state => {
  let query = queryString.parse(window.location.search)
  delete query.id
  query = queryString.stringify(query)

  return {
    apiSchema: (state.apiSchema && state.apiSchema.hasOwnProperty('type')) ? 
                state.apiSchema 
                : {
                    "$schema": "http://json-schema.org/draft-06/schema#",
                    "type": "object",
                    "properties": {
                        "name": {
                            "type": "string"
                        },
                        "description": {
                            "type": "string"
                        },
                        "path": {
                            "type": "string",
                            "pattern": null
                        },
                        "method": {
                            "type": "string",
                            "pattern": null
                        },
                        "query": {
                            "type": "object",
                            "properties": {
                            },
                            "required": []
                        },
                        "reqHeaders": {
                            "type": "object",
                            "properties": {
                            },
                            "required": []
                        },
                        "reqBody": {
                            "type": "string",
                            "minLength": 2,
                            "maxLength": 10
                        },
                        "resHeaders": {
                            "type": "object",
                            "properties": {},
                            "required": []
                        },
                        "resBody": {
                          "type": "object"
                        }
                    },
                    "required": ["name", "description", "path", "method", "reqHeaders", "resHeaders", "reqBody"]
                  },
    apiCfg: state.apiCfg
  }
}
  
// map dispatch to props
const mapDispatchToProps = dispatch => {
  return {
    onMounted: apiKey => {
      fetchRemoteApiSchema(apiKey, dispatch)
    },
    onUpdateClick: apiSchema => {
      updateRemoteApiSchema(apiSchema, dispatch)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ApiSchemaV)