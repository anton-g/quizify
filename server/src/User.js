`use strict`

const EventEmitter = require('events')
const nanoid = require('nanoid')

class User extends EventEmitter {
  constructor (socket) {
    super ()

    this.id = nanoid()
    this.socket = socket
    this.connected = true
  }

  updateConnectionStatus (status) {
    this.connected = status
  }
}

module.exports = User
