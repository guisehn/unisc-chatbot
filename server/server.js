'use strict'

require('dotenv').config({ silent: true })

const net = require('net')
const commands = require('./commands')

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
    send(socket, 'Comando não encontrado', () =>
      console.log(`Servidor não encontrou comando ${commandName} solicitado por ${address}`))
  }
}

// Logs internally that a response has been sent to an address
function logReturnMessage (message, address) {
  console.log(`Servidor enviou retorno de "${message}" para ${address}`)
}

const server = net.createServer(socket => {
  let address = `${socket.remoteAddress}:${socket.remotePort}`

  console.log(`Nova conexão estabelecida com ${address}, em ${new Date()}`)

  socket.on('data', data => {
    let message = data.toString()

    console.log(`Cliente ${address} solicitou: ${message}`)

    if (message.startsWith('\\')) {
      handleCommand(socket, address, message)
    } else {
      send(socket, message, () => logReturnMessage(message, address))
    }
  })

  socket.on('close', () => console.log(`Conexão encerrada com ${address}, em ${new Date()}`))
})

server.listen(1337, '0.0.0.0', () => {
  let address = server.address()
  console.log(`Servidor iniciado em ${address.address}:${address.port}`)
})
