'use strict'

const Promise = require('bluebird')

module.exports = () =>
  Promise.resolve((new Date()).toString())
