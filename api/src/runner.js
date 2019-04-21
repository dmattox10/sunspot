const ars = require('./scrapers/ars')
const mongoose = require('mongoose')
const moment = require('moment')
const Entry = require('./models/entry')
const async = require('async')
const arsPages = 6
const days = 30 // How long to keep news in the DB.
const arsURL = 'https://arstechnica.com/page/'

// All of the scrapers are run from here.
exports.updateDB = async () => {
    console.log("Updating DB.")
        // The Ars scraper (works)
        for (let i = 1; i < arsPages; i++) {
            await ars.get(arsURL + i).then(results => {
                results.map((result, index) => {
                mongoose.connection.db.listCollections({name: 'entries'})
                .next(function (err, collinfo) {
                    if (err) { console.log(err) }
                    if (collinfo) {
                        // Collection exists, test if entry exists, if not, save it
                        async.parallel({

                            entry: (callback) => {
                            Entry.findOne({ link: result.link})
                            .exec(callback)
                            }
                        }, (err, db) => {
                            if (err) { console.log(err) }
                            if (db.entry) {
                                // There already is one, move on
                                return
                            }
                            else {
                                // This entry does not exist! Save it!
                                let id = mongoose.Types.ObjectId()
                                let entry = new Entry(
                                    {
                                        _id: id,
                                        site: result.site,
                                        title: result.title,
                                        summary: result.summary,
                                        link: result.link,
                                        body: result.body,
                                        image: result.image
                                    }
                                )
                                entry.save((err) => {
                                    if (err) { console.log(err) }
                                })
                            }
                        })
                    }
                    else {
                        // This is our intial save, dump it all!
                        let id = mongoose.Types.ObjectId()
                        let entry = new Entry(
                            {
                                _id: id,
                                site: result.site,
                                title: result.title,
                                summary: result.summary,
                                link: result.link,
                                body: result.body,
                                image: result.image
                            }
                        )
                        entry.save((err) => {
                            if (err) { console.log(err) }
                        })
                    }
                })
            })   
        })
    }
    // The next scraper gets run here

}
// Removies stories older than 'days' days from the DB. Appears to work.
exports.cleanDB = async () => {
    console.log('Cleaning DB.')
    mongoose.connection.db.listCollections({name: 'entries'})
    .next(function (err, collinfo) {
        if (err) { console.log(err) }
        if (collinfo) {
            // Collection exists, test if entry exists, if not, save it
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
    console.log("done.")
}


// find().sort({ _id: 1 }).limit(10)
    
        
