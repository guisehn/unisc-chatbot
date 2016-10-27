'use strict'

const net = require('net')
const client = new net.Socket()
const stdin = process.openStdin()

console.log('Conectando...')

client.connect(1337, '0.0.0.0', () => {
  let waiting = false

  console.log('Conexão aberta!')
  console.log('\nDigite o comando: ')

  client.on('data', (data) => {
    console.log(`\nServidor:\n${data}`)
    console.log('\nDigite o comando: ')
    waiting = false
  })

  client.on('close', () => {
    console.log('\nConexão fechada')
    process.exit()
  })

  stdin.addListener('data', data => {
    if (waiting) return
    waiting = true

    let message = data.toString().trim()

    if (message.indexOf('\\exit') === 0) {
      client.destroy()
    } else {
      waiting = true
      client.write(message)
    }
  })
})
