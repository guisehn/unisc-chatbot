'use strict'

const Promise = require('bluebird')

const request = require('superagent')
require('superagent-as-promised')(request)

module.exports = (date) => {
  if (date === '') {
    date = 'latest'
  } else if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(date)) {
    return Promise.resolve('Date must be specified in YYYY-MM-DD format')
  }

  return request
    .get(`https://api.fixer.io/${date}?base=USD`)
    .then(response => {
      let result = JSON.parse(response.text)
      return `US$ 1 = R$ ${result.rates.BRL} on ${result.date}`
    })
    .catch(err => {
      if (err.response.status === 422) {
        return 'Error: ' + JSON.parse(err.response.text).error
      }

      return 'Error querying the Fixer API'
    })
}
