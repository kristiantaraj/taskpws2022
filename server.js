const express = require('express')

// config
const config = {
    appName: 'pws2022',
    port: 5555
}

// express initialization
const app = express()

// source of static content
app.use(express.static('frontend'))

// main process
app.listen(config.port)