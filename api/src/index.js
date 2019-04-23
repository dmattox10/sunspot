const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const config = require('./config/db')
const CronJob = require('cron').CronJob
const runner = require('./runner')
// S M 24H DoM M DoW
// 0 0 16 * * 1-5 // 4PM M-F
const entries = require('./routes/entries')

mongoose.connect(config.DB, { useNewUrlParser: true }).then(
    () => { console.log('Database is connected') },
    err => { console.log('Can not connect to the database'+ err) }
)

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/api/entries', entries)

app.get('/', function(req, res) {
    
    res.send('hello')
})

new CronJob('0 0 1 * * 1-5', () => {
    runner.updateDB()
}, null, true, 'America/New_York')

new CronJob('0 56 11 * 1-5', () => {
    runner.cleanDB()
}, null, true, 'America/New_York')

// Temporary Entry for testing purposes
new CronJob('0 40 14 * * 1-5', () => {
    runner.updateAT()
}, null, true, 'America/New_York')

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
})