const express = require('express')
const router = express.Router()
//const ars = require('./scrapers/ars')

router.get('/refresh', (req, res) => {
    console.log('refresh requested')
    res.send("Refreshing")
})

module.exports = router

/*
ars.getContent().then(result => {
            console.log(result)
        })
        */