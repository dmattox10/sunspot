const axios = require('axios')
const cheerio = require('cheerio')
const tools = require('../tools')

let results = []
let output = []

exports.get = async (url) => {
    try {
        const config = {
            method: 'get',
            url: url,
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0)' }
        }
        const response = await axios(config)
        const $ = cheerio.load(response.data)
        $('#main .contenWrapper .container').children('.river').map((i, element) => {
            const title = $(element).find('.item .thumbWrap').children('a').attr('title').text().trim() // 
            console.log(title)
            const link = $(element).find('.item .thumbWrap').children('a').attr('href') // 
            console.log(link)
            var imageLink = $(element).find('.item .thumbWrap').children('img').attr('src')
            console.log(imageLink)
            tools.img(String(imageLink)).then(image => {
                const data = {
                    title: title,
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
            let link = results[i].link
            let image = results[i].image
            const response = await axios.get(results[i].link)
            const $ = cheerio.load(response.data , {
                normalizeWhitespace: true
            })
            $('').map((i, element) => {
                const summary = $(element).find('.topContent .container').children('.summary').text().trim()
                console.log(summary)
                const body = $(element).find('#main .contentWrapper .storyBody').children('p').text().trim()
                console.log(body)
                const data = {
                    site: 'ZDNet',
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
