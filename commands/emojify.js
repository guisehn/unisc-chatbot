'use strict'

const Promise = require('bluebird')
const emoji = require('node-emoji')

module.exports = function () {
  let join = Array.prototype.join
  let input = join.call(arguments, ' ')
  let value = emoji.emojify(input)
  return Promise.resolve(value)
}
