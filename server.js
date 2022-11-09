const express = require('express')
const bodyParser = require('body-parser')
const mongodb = require('mongodb')

// config
const config = {
    appName: 'pws2022',
    port: 5555,
    dbUrl: 'mongodb://localhost:27017',
    dbName: 'pws2022'
}

// express initialization
const app = express()

// handle of database connection
let db = null

const api = (req, res) => {
    console.log('api called', req.method, req.url, req.body, req.query)
    let _id = null
    try { 
        _id = req.query._id ? mongodb.ObjectId(req.query._id) : null
    } catch(ex) {}
    switch(req.method) {
        case 'GET':
            db.collection('persons').find({}).toArray((err, data) => {
                res.json(data)
            })        
            return
        case 'POST':
            if(req.body.yearOfBirth < 100) {
                req.body.yearOfBirth = 1900 + req.body.yearOfBirth
            }
            persons.push(req.body)
            res.json(req.body)
            return
        case 'PUT':
            if(req.body.yearOfBirth < 100) {
                req.body.yearOfBirth = 1900 + req.body.yearOfBirth
            }
            if(isNaN(index)) {
                persons.push(req.body)
            } else {
                persons[index] = req.body
            }
            res.json(req.body)
            return
        case 'DELETE':
            db.collection('persons').deleteOne({ _id: _id }, (err, deleted) => {
                res.json(deleted)
            })
            break
        default:
            res.status(405).json({ error: 'Method not implemented' })
            return
    }
}

// source of static content
app.use(express.static('frontend'))

// extra modules for express
app.use(bodyParser.json())

// handle errors on body parser
app.use((err, req, res, nextTick) => {
    if(err) {
        res.status(400).json({ error: err.type })
    } else {
        nextTick()
    }
})

// special endpoint for data
app.all('/api', api)

// main process
mongodb.MongoClient.connect(config.dbUrl, { useUnifiedTopology: true }, (err, connection) => {
    if(err) {
        console.error('Connection to database cannot be established')
        process.exit(0)
    }
    db = connection.db(config.dbName)
    app.listen(config.port)        
})