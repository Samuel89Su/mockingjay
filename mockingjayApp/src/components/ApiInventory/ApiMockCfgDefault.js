const validator = {
  type: 'custom',
  value: '',
  errMsg: 'error'
}
const reactor = {
  type: 'custom',
  value: '',
  errMsg: 'error'
}

export default {
  validateReq: false,
  reqDescriptor: {
    queries: [],
    headers: [],
    body: {
      required: false,
      validator: validator
    }
  },
  resDescriptor: {
    headers: [],
    body: {
      optional: true,
      reactor: reactor
    }
  },
  reqKeyDescriptor: {
    key: '',
    required: false,
    validator: validator
  },
  validator: validator,
  resKeyDescriptor: {
    key: '',
    optional: true,
    reactor: reactor
  },
  reactor: reactor
}
