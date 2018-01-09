const Ajv = require('ajv')

const apiSchemaArchitect = require('../src/apiSchemaArchitect')

let schema = null
schema = apiSchemaArchitect.setPath('/api/login')
schema = apiSchemaArchitect.addQuery('id', 'integer', schema, true, {
  'minimum': 2,
  'maximum': 55555
})
schema = apiSchemaArchitect.setReqBody('string', schema, true, {
  'minLength': 2,
  'maxLength': 10
})

const querySchema = schema.properties.query
console.log(querySchema)

const ajv = new Ajv()
const validate = ajv.compile(querySchema)
const valid = validate({id: 55556})
if (!valid) {
  console.log(JSON.stringify(validate.errors))
}
