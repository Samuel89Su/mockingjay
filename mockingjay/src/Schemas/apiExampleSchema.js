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
            'type': 'object',
            'properties': {},
            'required': []
        },
        'resHeader': {
            'type': 'object',
            'properties': {},
            'required': []
        },
        'resBody': {
            'type': 'object',
            'properties': {},
            'required': []
        },
    },
    'required': ['query', 'reqHeader', 'resHeader']
}
