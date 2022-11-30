const db = require('./db')

module.exports = (req, res) => {
    let collection = db.connection.collection(req.params.collection)
    let _id = null
    try { 
        _id = req.query._id ? db.ObjectId(req.query._id) : null
    } catch(ex) {}
    switch(req.method) {
        case 'GET':
            collection.find({}).toArray((err, data) => {
                res.json(data)
            })        
            break
        case 'POST':
            if(req.body.yearOfBirth < 100) {
                req.body.yearOfBirth = 1900 + req.body.yearOfBirth
            }
            collection.insertOne(req.body, (err, data) => {
                res.json(data)    
            })
            break
        case 'PUT':
            if(req.body.yearOfBirth < 100) {
                req.body.yearOfBirth = 1900 + req.body.yearOfBirth
            }
            delete req.body._id
            collection.findOneAndUpdate({ _id: _id }, { $set: req.body }, { returnDocument: 'after' }, (err, data) => {
                res.json(data)    
            })
            break
        case 'DELETE':
            collection.deleteOne({ _id: _id }, (err, data) => {
                res.json(data)
            })
            break
        default:
            res.status(405).json({ error: 'Method not implemented' })
            break
    }
}