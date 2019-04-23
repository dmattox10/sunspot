const axios = require('axios')
const cheerio = require('cheerio')
const tools = require('../tools')

const baseURL = 'https://www.anandtech.com'
let results = []
let output = []

exports.get = async (url) => {
    try {
        const config = {
            method: 'get',
            url: url,
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0)' }
        }
        console.log('scraping anand.')
        const response = await axios(config)
        const $ = cheerio.load(response.data)
        $('.content .main_cont div.cont_box1.l_').map((i, element) => {
            const title = $(element).find('.cont_box1_txt h2').children('a').text().trim() // works
            const link = baseURL + $(element).find('.cont_box1_pic.pie').children('a').attr('href') // works
            const imageLink = $(element).find('.cont_box1_pic.pie a.crop160').children('img').attr('src') // works
            const summary = $(element).find('.cont_box1_txt').children('p').text().trim() || null// works
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
    } catch (error) {
        console.error("first half failed:  " + error)
    }
    try {
        for (let i = 0; i < results.length; i++) {
            let title = results[i].title
            let link = results[i].link
            let image = results[i].image
            let summary = results[i].summary
            const config = {
                method: 'get',
                url: results[i].link,
                headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0)' }
            }
            const response = await axios(config)
            const $ = cheerio.load(response.data , {
                normalizeWhitespace: true
            })
            $('section.content section.main_cont').map((i, element) => {
                const body = $(element).find('div.articleContent').children('p').text().trim()
                const data = {
                    site: 'AnandTech',
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
        console.error("second half failed: " + error)
    }
    return output
}
