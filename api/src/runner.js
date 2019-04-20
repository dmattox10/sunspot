const ars = require('./scrapers/ars')
const mongoose = require('mongoose')
const Entry = require('./models/entry')
const async = require('async')
const pages = 5
const url = 'https://arstechnica.com/page/'
exports.updateDB = async () => {
    console.log("Updating DB.")
        for (let i = 0; i < pages; i++) {
            await ars.get(url + i).then(results => {
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
                                        body: result.body
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
                                body: result.body
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
}

/*
ars.getContent().then(result => {
            console.log(result)
        })
        */

   
    
        
