'use strict'

const Promise = require('bluebird')
const emoji = require('node-emoji')

module.exports = function (text) {
  let value = emoji.emojify(text)
  return Promise.resolve(value)
}
