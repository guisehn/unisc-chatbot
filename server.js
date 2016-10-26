'use strict'

const net = require('net')
const commands = require('./commands')

var server = net.createServer(socket => {
  const address = `${socket.remoteAddress}:${socket.remotePort}`

  console.log(`Nova conexão estabelecida com ${address}, em ${new Date()}`)

  socket.on('data', data => {
    let message = data.toString()

    console.log(`Cliente ${address} solicitou: ${message}`)

    let parts = message.split(' ')
    let commandName = parts[0]
    let command = commands[commandName]

    if (command) {
      let args = parts.splice(1)

      command.apply(null, args).then(response => {
        socket.write(response, () =>
          console.log(`Servidor enviou retorno de "${message}" para ${address}`))
      })
    } else {
      socket.write('Comando não encontrado', () =>
        console.log(`Servidor não encontrou comando ${commandName} solicitado por ${address}`))
    }
  })

  socket.on('close', () =>
    console.log(`Conexão encerrada com ${address}, em ${new Date()}`))
})

server.listen(1337, '0.0.0.0', () => {
  let address = server.address()
  console.log(`Servidor iniciado em ${address.address}:${address.port}`)
})
