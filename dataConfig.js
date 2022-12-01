const ajv = require('ajv')
const ajvFormats = require('ajv-formats')

const dataConfig = module.exports = {

    persons: {
        schema: {
            type: 'object',
            properties: {
              firstName: { type: 'string' },
              lastName: { type: 'string' },
              yearOfBirth: { type: 'integer' },
              email: { type: 'string', format: 'email' }
            },
            required: [ 'firstName', 'lastName', 'yearOfBirth' ],
            additionalProperties: false
        },
        prepareData: (body) => {
            initValidator('persons')
            if(!dataConfig.persons._validate(body)) return { error: dataConfig.persons._validate.errors }

            if(body.yearOfBirth < 100) {
                body.yearOfBirth = 1900 + body.yearOfBirth
            }
            return null
        }
    },

    projects: {

    }
}

let _ajv = null

const initValidator = (collectionName) => {
    if(!_ajv) {
        _ajv = new ajv()
        ajvFormats(_ajv)
    }
    if(collectionName && !dataConfig[collectionName]._validate && dataConfig[collectionName].schema) {
        dataConfig[collectionName]._validate = _ajv.compile(dataConfig[collectionName].schema)
    }
}