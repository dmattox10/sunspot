const axios = require('axios')
const cheerio = require('cheerio')
const tools = require('../tools')
const home = 'https://arstechnica.com'

let results = []
let output = []
exports.getHome = async () => {
    try {
        const response = await axios.get(home)
        const $ = cheerio.load(response.data)
        $('.site-wrapper #main .tease').map((i, element) => {
            const title = $(element).find('h2').children('a').text() // works
            const summary = $(element).find('.excerpt').text() // works
            const link = $(element).find('a').attr('href') //works
            const data = {
                title: title,
                summary: summary,
                link: link
            }
            results.push(data)
        })
    } catch (error) {
        console.error("Something bad happened: " + error)
    }
    try {
        for (let i = 0; i < results.length; i++) {
            const response = await axios.get(results[i].link)
            const $ = cheerio.load(response.data)
            $('.site-wrapper #main .article-guts').map((i, element) => {
                const body = $(element).find('.article-content').children().not('#article-footer-wrap').not('#comments-area').not('#social-left').not('.xrail').not('#social-footer').text().trim()
                const data = {
                    site: 'ars',
                    title: results[i].title,
                    summary: results[i].summary,
                    link: results[i].link,
                    body: body
                }
                output.push(data)
            })
        }
    }
    catch (error) {
        console.error("Something bad happened: " + error)
    }
    return output
  }