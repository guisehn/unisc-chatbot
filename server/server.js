'use strict'

const net = require('net')
const commands = require('./commands')

const server = net.createServer(socket => {
  let address = `${socket.remoteAddress}:${socket.remotePort}`

  console.log(`Nova conexão estabelecida com ${address}, em ${new Date()}`)

  socket.on('data', data => {
    let message = data.toString()

    console.log(`Cliente ${address} solicitou: ${message}`)

    if (message.startsWith('\\')) {
      handleCommand(socket, address, message)
    } else {
      socket.write(message, () => logReturnMessage(message, address))
    }
  })

  socket.on('close', () => console.log(`Conexão encerrada com ${address}, em ${new Date()}`))
})

server.listen(1337, '0.0.0.0', () => {
  let address = server.address()
  console.log(`Servidor iniciado em ${address.address}:${address.port}`)
})

function handleCommand(socket, address, message) {
  let parts = message.split(' ')
  let commandName = parts[0].replace('\\', '')
  let command = commands[commandName]

  if (command) {
    let argument = parts.splice(1).join(' ')

    command(argument).then(response => {
      socket.write(response, () => logReturnMessage(message, address))
    })
  } else {
    socket.write('Comando não encontrado', () =>
      console.log(`Servidor não encontrou comando ${commandName} solicitado por ${address}`))
  }
}

function logReturnMessage(message, address) {
  console.log(`Servidor enviou retorno de "${message}" para ${address}`)
}
