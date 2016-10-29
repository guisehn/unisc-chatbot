'use strict'

const net = require('net')
const client = new net.Socket()
const stdin = process.openStdin()
const argument = (process.argv[2] || '').split(':')

let server = argument[0] ? argument[0] : '0.0.0.0'
let port = argument[1] ? argument[1] : 1337

console.log(`Conectando em ${server}:${port}`)

client.connect(port, server, () => {
  let waiting = false

  console.log('Conexão aberta!')
  console.log('\nDigite o comando: ')

  client.on('data', (data) => {
    console.log(`\nServidor:\n${data}`)
    console.log('\nDigite o comando: ')
    waiting = false
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

client.on('close', () => {
  console.log('Conexão fechada')
  process.exit()
})

client.on('error', err => {
  console.log(`Erro na conexão (${err.message})`)
})
