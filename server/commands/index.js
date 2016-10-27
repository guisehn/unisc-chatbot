'use strict'

const fs = require('fs')
const commands = {}

fs
  .readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 && file !== 'index.js')
  .forEach(file => {
    let commandName = file.replace('.js', '')
    commands[commandName] = require(`./${file}`)
  })

module.exports = commands
