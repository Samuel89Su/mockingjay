'use strict'

exports = module.exports = {
    '$schema': 'http://json-schema.org/draft-06/schema#',
    'type': 'object',
    'properties': {
        'query': {
            'type': 'object',
            'properties': {},
            'required': []
        },
        'reqHeader': {
            'type': 'object',
            'properties': {},
            'required': []
        },
        'reqBody': {
            'type': 'string'
        },
        'resHeader': {
            'type': 'object',
            'properties': {},
            'required': []
        },
        'resBody': {
            'type': 'string'
        },
    },
    'required': ['query', 'reqHeader', 'resHeader']
}
