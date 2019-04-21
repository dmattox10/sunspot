const axios = require('axios')
const cheerio = require('cheerio')
const tools = require('../tools')
const btoa = require('btoa')

let results = []
let output = []
exports.get = async (url) => {
    try {
        const response = await axios.get(url)
        const $ = cheerio.load(response.data)
        $('.site-wrapper #main .tease').map((i, element) => {
            const title = $(element).find('h2').children('a').text() // works
            const summary = $(element).find('.excerpt').text() // works
            const link = $(element).find('a').attr('href') //works
            const imageLink = $(element).find('div.listing').css('background-image')
            img(String(imageLink)).then(image => {
                const data = {
                    title: title,
                    summary: summary,
                    link: link,
                    image: image
                }
                results.push(data)
            })
            
        })
    } catch (error) {
        console.error("Something bad happened: " + error)
    }
    try {
        for (let i = 0; i < results.length; i++) {
            let title = results[i].title
            let summary = results[i].summary
            let link = results[i].link
            let image = results[i].image
            const response = await axios.get(results[i].link)
            const $ = cheerio.load(response.data , {
                normalizeWhitespace: true
            })
            $('.site-wrapper #main .article-guts').map((i, element) => {
                const body = $(element).find('.article-content').children().not('#article-footer-wrap').not('#comments-area').not('#social-left').not('.xrail').not('#social-footer').text().trim()
                const data = {
                    site: 'ars',
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
    image = image.substr(5, image.length - 7)
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
  /*
  (body.find('.intro-image.intro-left').children('img').attr('src') ? 
                    image = $(element.find('.intro-image.intro-left').children('img').attr('src'))
                    : 
                    image = $(element.find('.image.shortcode-img').children('img').attr('src'))
                )
                const image_data = tools.img(image)
                image_data.then(ouput => {
                    console.log(output)
                    
                })
    */