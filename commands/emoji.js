'use strict'

const Promise = require('bluebird')
const emoji = require('node-emoji')

module.exports = (input) => {
  let value = emoji.get(input)
  return Promise.resolve(value[0] === ':' ? 'Emoji not found' : value)
}
