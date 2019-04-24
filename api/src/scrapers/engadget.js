const axios = require('axios')
const cheerio = require('cheerio')
const tools = require('../tools')
const baseURL = 'https://www.engadget.com'
let results = []
let output = []

exports.get = async (url) => {
    try {
        console.log('scraping engadget.')
        const config = {
            method: 'get',
            url: url,
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0)' }
        }
        const response = await axios(config)
        const $ = cheerio.load(response.data, {decodeEntities: false})
        $('div#engadget-the-latest div.container\\@m.container\\@tp').map((i, el) => {
            const title = $(el).find('span.th-underline').not(':first-child').text().trim() // works
            const link = baseURL + $(el).find('a.o-hit__link').not(':first-child').attr('href') 
            console.log(link)
            const summary = $(el).find('div.hide\\@s').not(':first-child').children('p').text().trim() //works
            /*
            const data = {
                title: title,
                summary: summary,
                link: link,
            }
            results.push(data)
            */
        })
    }
    catch (error) {
        console.log(error)
    }
    /*
    try {
        for (let i = 0; i < results.length; i++) {
            let title = results[i].title
            let link = results[i].link
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
            $('body.th-base main.th-base.o-h div.grid.flex article.c-gray-1 div#page_body div.o-article_block.').map((i, el) => {
                const body = $(el).find('article-text.c-gray-1').children('p').text().trim()
                console.log(body)
                const imageLink = $(el).find('figure').children('img').attr('src')
                console.log(imageLink)
                tools.img(String(imageLink)).then(image => {
                    const data = {
                        site: 'Engadget',
                        title: title,
                        summary: summary,
                        link: link,
                        body: body,
                        image: image
                    }
                    output.push(data)
                })
            })

        }
    }
    catch (error) {
        console.log(error)
    }
    return output
    */
}