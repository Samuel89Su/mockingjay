const instanceTypes = {
  integer: {
    minimum: '\\d{1,8}',
    maximum: '\\d{1,8}'

  },
  number: {
    minimum: '\\d{1,8}',
    maximum: '\\d{1,8}'

  },
  string: {
    minLength: '\\d{1,8}',
    maxLength: '\\d{1,8}',
    pattern: null
  }
}

class APISchemaArchitect {
  constructor (arg) {
    this.baseSchema = {
      '$schema': 'http://json-schema.org/draft-06/schema#',
      'type': 'object',
      'properties': {
        'name': {
          'type': 'string'
        },
        'description': {
          'type': 'string'
        },
        'path': {
          'type': 'string',
          'pattern': null
        },
        'method': {
          'type': 'string',
          'pattern': null
        },
        'query': {
          'type': 'object',
          'properties': {},
          'required': []
        },
        'reqHeaders': {
          'type': 'object',
          'properties': {},
          'required': []
        },
        'reqBody': { },
        'resHeaders': {
          'type': 'object',
          'properties': {},
          'required': []
        },
        'resBody': { }
      },
      'required': [
        'name', 'description', 'path', 'method', 'reqHeaders', 'resHeaders'
      ]
    }
  }

  getBaseSchema () {
    return Object.assign({}, this.baseSchema)
  }

  /**
   * Set path pattern of schema.
   * @param path The pattern of path.
   * @param schema The json schema.
   */
  setPath (path, schema) {
    if (!schema) {
      schema = this.getBaseSchema()
    }

    schema['properties']['path']['pattern'] = path
    return schema
  }

  /**
   * Set method pattern of schema.
   * @param path The pattern of method.
   * @param schema The json schema.
   */
  setMethod (method, schema) {
    if (!schema) {
      schema = this.getBaseSchema()
    }

    schema['properties']['method']['pattern'] = method
    return schema
  }

  /**
   * Add query schema.
   * @param key The key of query.
   * @param type The type of query.
   * @param schema The json schema.
   * @param required Is a required query.
   * @param opts Other schema options.
   */
  addQuery (key, type, schema, required, opts) {
    if (!schema) {
      schema = this.getBaseSchema()
    }

    if (['boolean', 'integer', 'number', 'string'].includes(type)) {
      schema['properties']['query']['properties'][key] = Object.assign({}, { 'type': type }, opts)
    } else {
      schema['properties']['query']['properties'][key] = opts
    }

    if (required) {
      schema['properties']['query']['required'].push(key)
    }

    return schema
  }

  /**
   * Add request header schema.
   * @param key The key of header.
   * @param type The type of header.
   * @param schema The json schema.
   * @param required Is a required header.
   * @param opts Other schema options.
   */
  addReqHeader (key, type, schema, required, opts) {
    if (!schema) {
      schema = this.getBaseSchema()
    }

    if (['boolean', 'integer', 'number', 'string'].includes(type)) {
      schema['properties']['reqHeaders']['properties'][key] = Object.assign({}, { 'type': type }, opts)
    } else {
      schema['properties']['reqHeaders']['properties'][key] = opts
    }

    if (required) {
      schema['properties']['reqHeaders']['required'].push(key)
    }

    return schema
  }

  /**
   * Set request body schema.
   * @param type The type of body.
   * @param schema The json schema.
   * @param required Is body required.
   * @param opts Other schema options.
   */
  setReqBody (type, schema, required, opts) {
    if (!schema) {
      schema = this.getBaseSchema()
    }

    if (['boolean', 'integer', 'number', 'string'].includes(type)) {
      schema['properties']['reqBody'] = Object.assign({}, { 'type': type }, opts)
    } else {
      schema['properties']['reqBody'] = opts
    }

    if (required) {
      schema['required'].push('reqBody')
    }

    return schema
  }

  /**
   * Add response header schema.
   * @param key The key of header.
   * @param type The type of header.
   * @param schema The json schema.
   * @param required Is a optional header.
   * @param opts Other schema options.
   */
  addResHeader (key, type, schema, optional, opts) {
    if (!schema) {
      schema = this.getBaseSchema()
    }

    if (['boolean', 'integer', 'number', 'string'].includes(type)) {
      schema['properties']['resHeaders']['properties'][key] = Object.assign({}, { 'type': type }, opts)
    } else {
      schema['properties']['resHeaders']['properties'][key] = opts
    }

    if (!optional) {
      schema['properties']['resHeaders']['required'].push(key)
    }

    return schema
  }

  /**
   * Set response body schema.
   * @param type The type of body.
   * @param schema The json schema.
   * @param required Is body optional.
   * @param opts Other schema options.
   */
  setResBody (type, schema, optional, opts) {
    if (!schema) {
      schema = this.getBaseSchema()
    }

    if (['boolean', 'integer', 'number', 'string'].includes(type)) {
      schema['properties']['resBody'] = Object.assign({}, { 'type': type }, opts)
    } else {
      schema['properties']['resBody'] = opts
    }

    if (!optional) {
      schema['required'].push('resBody')
    }

    return schema
  }
}

exports = module.exports = new APISchemaArchitect()
