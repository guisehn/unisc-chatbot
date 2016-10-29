'use strict'

const cheerio = require('cheerio')

const request = require('superagent')
require('superagent-as-promised')(request)

module.exports = () => {
  return request
    .get('http://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml')
    .then(response => {
      let $ = cheerio.load(response.text, { xmlMode: true })
      let first = $('item').first()
      let title = first.find('title').text()
      let description = first.find('description').text()
      let date = first.find('pubDate').text()
      let permalink = first.find('guid').text()

      return `${title}\n${description}\n${date}\n${permalink}`
    })
    .catch(err => {
      console.log(err)
      return 'Error querying the New York Times server'
    })
}
