const axios = require('axios')
const cheerio = require('cheerio')
const tools = require('../tools')

let results = []
let output = []

exports.get = async (url) => {
    try {
        const response = await axios.get(url)
        const $ = cheerio.load(response.data)
        $('#content .wrapper #features ul li').map((i, element) => {
            const title = $(element).find('h3').children('a').text()
            const summary = $(element).find('div.desc').text()
            const link = $(element).find('h3').children('a').attr('href')
            const imageLink = $(element).find('li div.img a').children('img').attr('src')
            tools.img(String(imageLink)).then(image => {
                const data = {
                    title: title,
                    summary: summary,
                    link: link,
                    image: image
                }
                results.push(data)
            })
        })
    }
    catch (error) {
        console.log(error)
    }
    try {
        for (let i = 0; i < results.length; i++) {
            let title = results[i].title
            let summary = results[i].summary
            let link = results[i].link
            console.log(link)
            let image = results[i].image
            const response = await axios.get(results[i].link)
            const $ = cheerio.load(response.data , {
                normalizeWhitespace: true
            })
            $('#GlobalWrapper #content article .wrapper .wrapperMobileOnly .col-2-3-last').map((i, element) => {
                const body = $(element).find('#feature').children('p').not('p.grey').text().trim()
                const data = {
                    site: 'Tech Spot',
                    title: title,
                    summary: summary,
                    link: link,
                    body: body,
                    image: image
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

async function img(image) {
    try {
        let response = await axios.get(image, {
            responseType: 'blob'
        })
        let contents = Buffer.from(response.data).toString('base64')
        return `data:${response.headers['content-type'].toLowerCase()};base64,${contents}`
        
    }
    catch (error) {
        console.log(error)
    }
}