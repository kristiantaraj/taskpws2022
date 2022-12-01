const db = require('./db')
const dataConfig = require('./dataConfig')

const alterInputData = (collectionName, body) => {
    if(dataConfig[collectionName] && dataConfig[collectionName].prepareData) {
        let err = dataConfig[collectionName].prepareData(body)
        return err
    }
    return null
}

module.exports = (req, res) => {
    let collectionName = req.params.collection
    let collection = db.connection.collection(collectionName)
    let _id = null
    try { 
        _id = req.query._id ? db.ObjectId(req.query._id) : null
    } catch(ex) {}
    let err = null
    switch(req.method) {
        case 'GET':
            collection.find({}).toArray((err, data) => {
                res.json(data)
            })        
            break
        case 'POST':
            err = alterInputData(collectionName, req.body)
            if(err) {
                res.status(400).json(err)
                break
            }
            collection.insertOne(req.body, (err, data) => {
                res.json(data)    
            })
            break
        case 'PUT':
            err = alterInputData(collectionName, req.body)
            if(err) {
                res.status(400).json(err)
                break
            }
            collection.findOneAndUpdate({ _id: _id }, { $set: req.body }, { returnDocument: 'after' }, (err, data) => {
                if(!err) {
                    delete data.value
                    // without the code below the result contains complete data of updated object,
                    // maybe with sensible information
                }
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