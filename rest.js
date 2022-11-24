const db = require('./db')

module.exports = (req, res) => {
    let _id = null
    try { 
        _id = req.query._id ? db.ObjectId(req.query._id) : null
    } catch(ex) {}
    switch(req.method) {
        case 'GET':
            db.persons.find({}).toArray((err, data) => {
                res.json(data)
            })        
            break
        case 'POST':
            if(req.body.yearOfBirth < 100) {
                req.body.yearOfBirth = 1900 + req.body.yearOfBirth
            }
            db.persons.insertOne(req.body, (err, data) => {
                res.json(data)    
            })
            break
        case 'PUT':
            if(req.body.yearOfBirth < 100) {
                req.body.yearOfBirth = 1900 + req.body.yearOfBirth
            }
            delete req.body._id
            db.persons.findOneAndUpdate({ _id: _id }, { $set: req.body }, { returnDocument: 'after' }, (err, data) => {
                res.json(data)    
            })
            break
        case 'DELETE':
            db.persons.deleteOne({ _id: _id }, (err, data) => {
                res.json(data)
            })
            break
        default:
            res.status(405).json({ error: 'Method not implemented' })
            break
    }
}