const ars = require('./scrapers/ars')
const ts = require('./scrapers/ts')
const zd = require('./scrapers/zd')
const en = require('./scrapers/engadget')
const anand = require('./scrapers/anand')
const mongoose = require('mongoose')
const moment = require('moment')
const Entry = require('./models/entry')
const async = require('async')
const pages = 6
const days = 30 // How long to keep news in the DB.
const arsURL = 'https://arstechnica.com/page/'
const tsURL = 'https://www.techspot.com/features/'
const zdnetURL = 'https://www.zdnet.com/'
const anandURL = 'https://www.anandtech.com/Page/'
const engadgetURL = 'https://www.engadget.com/all/page/'

var log = require('./log.js')


let saves = 0
// All of the scrapers are run from here.
exports.updateDB = async () => {
    /*
    console.log("Updating DB.")
    // The Ars scraper (works)
    for (let i = 1; i < pages; i++) {
        await ars.get(arsURL + i).then(results => {
            results.map((result, index) => {
                store(result.site, result.title, result.summary, result.link, result.body, result.image)
            })
        })
    }                   
    console.log("ars done.")

    
    // TechSpot Features Scraper

    console.log("Updating DB.")
    for (let i = 1; i < pages; i++) {
        await ts.get(tsURL + i).then(results => {
            results.map((result, index) => {
                store(result.site, result.title, result.summary, result.link, result.body, result.image)
            })
        })
    }                  
    console.log('ts done.')


    // AnandTech scraper

    console.log("Updating DB.")
    for (let i = 1; i < pages; i++) {
        await anand.get(anandURL + i).then(results => {
            results.map((result, index) => {
                store(result.site, result.title, result.summary, result.link, result.body, result.image)
            })
        })
    }                  
    console.log('anand done.')
    */
    /*
    // zd scraper
    console.log("Updating DB.")
    for (let i = 1; i < pages; i++) {
        await zd.get(zdnetURL + i).then(results => {
            results.map((result, index) => {
                store(result.site, result.title, result.summary, result.link, result.body, result.image)
            })
        })
    }
    */
    // engadget scraper
    console.log("Updating DB.")
    for (let i = 1; i < pages; i++) {
        await en.get(engadgetURL + i)
        /*
        .then(results => {
            results.map((result, index) => {
                store(result.site, result.title, result.summary, result.link, result.body, result.image)
            })
        })
        */
    }                   
    console.log("en done.")
}

// Removies stories older than 'days' days from the DB. Appears to work.
exports.cleanDB = async () => {
    console.log('Cleaning DB.')
    mongoose.connection.db.listCollections({name: 'entries'})
    .next(function (err, collinfo) {
        if (err) { console.log(err) }
        if (collinfo) {
            async.parallel({

                entries: (callback) => {
                Entry.find().sort({ _id: 1 }).limit(1000)
                .exec(callback)
                }
            }, (err, db) => {
                if (err) { console.log(err) }
                if (db.entries) {
                    // The db isn't empty, compare and delete stuff
                    db.entries.map(entry => {
                        let now = moment()
                        let then = moment(entry.date)
                        console.log(now.diff(then, 'days')) // Leave this in here a month!
                        if (now.diff(then, 'days') > days) { // change this to -30 if entries aren't deleting but I think I got it right
                            Entry.deleteOne({ id: entry._id }, function (err) {
                                if (err) { console.log(err) }
                            })
                        }
                        else {
                            return
                        }
                    })
                }
                else {
                    // There is nothing in the DB, do nothing
                    return
                }
            })
        }
        else {
            //there is nothing in the DB, do nothing
            return
        }
    })
}    
// Saves the actual DB entries
async function store (site, title, summary, link, body, image) {
    let start = {
        site: site,
        title: title,
        summary: summary,
        link: link,
        body: body,
        image: image
    }
    let finish = {
        site: site,
        title: title,
        summary: summary,
        link: link,
        body: body,
        image: image
    }
    let options = {
        upsert: true
    }
    await Entry.findOneAndUpdate(
        start,
        finish,
        options
    )
    /*
    log.debug('Saving:')
    log.trace('Site: ' + site)
    log.trace('Title: ' + title)
    log.trace('Link: ' + link)
    log.info('Done.')
    */
    /*
    let entry = new Entry(
        {
            site: site,
            title: title,
            summary: summary,
            link: link,
            body: body,
            image: image
        }
    )
    await entry.save((err) => {
        if (err) { console.log(err) }
        saves++
    })
    */
}
