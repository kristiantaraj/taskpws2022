const express = require('express')

// config
const config = {
    appName: 'pws2022',
    port: 5555
}

// express initialization
const app = express()

let data = {
    firstName: 'Mariusz',
    lastName: 'Jarocki',
    yearOfBirth: 1969
}

const api = (req, res) => {
    console.log('api called', req.method, req.url)
    res.json(data)
}

// source of static content
app.use(express.static('frontend'))

// special endpoint for data
app.all('/api', api)

// main process
app.listen(config.port)