const express = require('express')
const bodyParser = require('body-parser')

// config
const config = {
    appName: 'pws2022',
    port: 5555
}

// express initialization
const app = express()

let persons = [
    { firstName: 'Mariusz', lastName: 'Jarocki', yearOfBirth: 1969 },
    { firstName: 'Wojciech', lastName: 'Horzelski', yearOfBirth: 1967 },
    { firstName: 'Dariusz', lastName: 'Doliwa', yearOfBirth: 1967 }
]

const api = (req, res) => {
    console.log('api called', req.method, req.url, req.body, req.query)
    let index = parseInt(req.query.index)
    if(!isNaN(index) && (index < 0 || index >= persons.length)) {
        res.status(400).json({ error: 'Wrong index' })
        return    
    }
    switch(req.method) {
        case 'GET':
            if(isNaN(index)) break
            res.json(persons[index])
            return
        case 'POST':
            persons.push(req.body)
            break
        case 'PUT':
            if(isNaN(index)) {
                persons.push(req.body)
            } else {
                persons[index] = req.body
            }
            break
        case 'DELETE':
            persons.splice(index, 1)
            break
        default:
            res.status(405).json({ error: 'Method not implemented' })
            return
    }
    res.json(persons)
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
app.listen(config.port)