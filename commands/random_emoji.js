'use strict'

const Promise = require('bluebird')
const emoji = require('node-emoji')

module.exports = () => Promise.resolve(emoji.random().emoji)
