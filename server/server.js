'use strict'

require('dotenv').config({ silent: true })

const net = require('net')
const commands = require('./commands')

const argument = (process.argv[2] || '').split(':')
const host = argument[0] ? argument[0] : '0.0.0.0'
const port = argument[1] ? argument[1] : 1337

// Sends a message for a socket adding STX and ETX control characters
function send (socket, message, callback) {
  return socket.write('\x02' + message + '\x03', callback)
}

// Process command sent by the client and send the response back
function handleCommand (socket, address, message) {
  let parts = message.split(' ')
  let commandName = parts[0].replace('\\', '')
  let command = commands[commandName]

  if (command) {
    let argument = parts.splice(1).join(' ')

    command(argument).then(response => {
      send(socket, response, () => logReturnMessage(message, address))
    })
  } else {
    send(socket, 'Command not found', () =>
      console.log(`Server could not found the command ${commandName} sent by ${address}`))
  }
}

// Logs internally that a response has been sent to an address
function logReturnMessage (message, address) {
  console.log(`Server sent response for "${message}" to ${address}`)
}

const server = net.createServer(socket => {
  let address = `${socket.remoteAddress}:${socket.remotePort}`

  console.log(`New connection established with ${address}, on ${new Date()}`)

  socket.on('data', data => {
    let message = data.toString()

    console.log(`Client ${address} sent: ${message}`)

    if (message.startsWith('\\')) {
      handleCommand(socket, address, message)
    } else {
      send(socket, message, () => logReturnMessage(message, address))
    }
  })

  socket.on('close', () => console.log(`Connection closed with ${address}, on ${new Date()}`))
})

server.listen(port, host, () => {
  let address = server.address()
  console.log(`Server running at ${address.address}:${address.port}`)
})
