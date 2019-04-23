const mongoose = require('mongoose')

const Schema = mongoose.Schema

const EntrySchema = new Schema({
    site: {
        type: String,
        required: false
    },
    title: {
        type: String,
        required: false
    },
    summary: {
        type: String,
        required: false
    },
    link: {
        type: String,
        required: false
    },
    body: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const Entry = mongoose.model('entries', EntrySchema)

module.exports = Entry