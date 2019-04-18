const ars = require('./scrapers/ars')
const mongoose = require('mongoose')
const Entry = require('./models/entry')
const async = require('async')

exports.updateDB = () => {
    console.log("Updating DB.")
    ars.getHome().then(results => {
        results.map((result, index) => {
    
            mongoose.connection.db.listCollections({name: 'entries'})
            .next(function (err, collinfo) {
                if (err) { return next(err) }
                if (collinfo) {
                    // Collection exists, test if entry exists, if not, save it
                    async.parallel({

                        entry: (callback) => {
                        Entry.find({ link: result.link}).limit(1)
                        .exec(callback)
                        }
                    }, (err, db) => {
                        if (err) { console.log(err) }
                        if (db) {
                            // There already is one, move on
                            console.log('LINK ' + db.entry + ' EXISTS')
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

/*
ars.getContent().then(result => {
            console.log(result)
        })
        */

   
    
        
