'use strict'

const request = require('superagent')
require('superagent-as-promised')(request)

module.exports = () => {
  return request
    .get('https://api.whatdoestrumpthink.com/api/v1/quotes/random')
    .then(response => JSON.parse(response.text).message)
    .catch(() => 'Error querying the remote server')
}
