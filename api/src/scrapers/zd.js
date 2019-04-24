const axios = require('axios')
const cheerio = require('cheerio')
const tools = require('../tools')
const baseURL = 'https://www.zdnet.com'

let results = []
let output = []

exports.get = async (url) => {
    try {
        const config = {
            method: 'get',
            url: url,
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0)' }
        }
        console.log('scraping zd.')
        const response = await axios(config)
        const $ = cheerio.load(response.data)
        $('div#main div.contentWrapper div.container div.front-door-river article.item').map((i, element) => {
            const title = $(element).find('div div.content h3').children('a').text().trim() // 
            console.log(title)
            const link = baseURL + $(element).find('div div.content h3').children('a').attr('href') // 
            console.log(link)
            var imageLink = $(element).find('div div.thumbWrap a.thumb span.img').children('img').attr('src')
            console.log(imageLink)
            /*
            tools.img(String(imageLink)).then(image => {
                const data = {
                    title: title,
                    link: link,
                    image: image
                }
                results.push(data)
            })
            */
            
        })
    } catch (error) {
        console.error("Something bad happened: " + error)
    }
    /*
    try {
        for (let i = 0; i < results.length; i++) {
            let title = results[i].title
            let link = results[i].link
            let image = results[i].image
            const response = await axios.get(results[i].link)
            const $ = cheerio.load(response.data , {
                normalizeWhitespace: true
            })
            $('div.not-logged-in.touch-disabled.skybox-auto-collapse.skybox-loaded').map((i, element) => {
                const summary = $(element).find('div.topContent.container header.storyHeader.article').children('p').text().trim()
                console.log(summary)
                const body = $(element).find('div.main div.contentWrapper div.container article div.storyBody').children('p').text().trim()
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
    */
}
