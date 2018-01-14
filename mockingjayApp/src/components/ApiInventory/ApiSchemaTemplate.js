export default {
  '$schema': 'http://json-schema.org/draft-06/schema#',
  'type': 'object',
  'properties': {
    'name': '{ "type": "string" }',
    'description': '{ "type": "string" }',
    'path': '{ "type": "string", "pattern": "/api/login" }',
    'method': '{ "type": "string", "pattern": null }',
    'query': null,
    'reqHeaders': null,
    'reqBody': null,
    'resHeaders': null,
    'resBody': null
  },
  'required': [
    'name',
    'description',
    'path',
    'method',
    'reqHeaders',
    'resHeaders',
    'reqBody'
  ]
}
