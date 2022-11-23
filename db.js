const mongodb = require('mongodb')

const db = module.exports = {
    init: (config, nextTick) => {
        mongodb.MongoClient.connect(config.dbUrl, { useUnifiedTopology: true }, (err, connection) => {
            if(err) {
                console.error('Connection to database cannot be established')
                process.exit(0)
            }
            let connectionDb = connection.db(config.dbName)
            db.persons = connectionDb.collection('persons')
            console.log('Connection to database', config.dbName, 'established')
            nextTick()
        })
    },
    ObjectId: mongodb.ObjectId,
    persons: null
}