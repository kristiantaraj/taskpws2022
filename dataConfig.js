const ajv = require('ajv')
const ajvFormats = require('ajv-formats')

const dataConfig = module.exports = {

    persons: {
        aggregation: [
            { $project: { password: false } },
            { $sort: { lastName: 1, firstName: 1 } }
        ],
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
            if(!dataConfig.persons._validate(body)) return { error: 'data does not match the person schema' }

            if(body.yearOfBirth < 100) {
                body.yearOfBirth = 1900 + body.yearOfBirth
            }
            return null
        }
    },

    projects: {
        aggregation: [
            { $sort: { name: 1 } },
            { $lookup: { from: "persons", localField: "manager", foreignField: "_id", as: "manager" } },
            { $unwind: { path: "$manager", preserveNullAndEmptyArrays: true } },
            { $project: { "manager.password": false } }
          ]
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