'use strict'

const net = require('net')
const client = new net.Socket()
const stdin = process.openStdin()

const argument = (process.argv[2] || '').split(':')
const host = argument[0] ? argument[0] : '0.0.0.0'
const port = argument[1] ? argument[1] : 1337

console.log(`Connecting to ${host}:${port}`)

client.connect(port, host, () => {
  let waiting = false

  console.log('Connection open!')
  console.log('\nType your message: ')

  client.on('data', (data) => {
    let message = data.toString()

    // detects STX control character to show message start delimiter
    if (message[0] === `\x02`) {
      console.log('\nServer:')
    }

    // use stdout.write instead of console.log to prevent line breaks
    // in case message is split into multiple packets
    process.stdout.write(message)

    // detects ETX control character to release user input
    if (message[message.length - 1] === '\x03') {
      waiting = false
      console.log('\n\nType your message: ')
    }
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
  console.log('Connection closed')
  process.exit()
})

client.on('error', err => {
  console.log(`Connection error (message: ${err.message})`)
})
