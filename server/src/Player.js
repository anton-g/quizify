`use strict`

const User = require('./User')
const protocol = require('./protocol')

class Player extends User {
  constructor (socket, name) {
    super (socket)

    this.name = name
    this.score = 0

    this.socketSetUp(this.socket)
  }

  scored (score) {
    this.score += score
    this.socket.emit('quiz_scored', score)
  }

  lost () {
    this.socket.emit('quiz_ended', false)
  }

  won () {
    this.socket.emit('quiz_ended', true)
  }

  reconnect (socket) {
    this.socket = socket

    this.socketSetUp(this.socket)
  }

  socketSetUp (socket) {
    socket.on('buzz', () => {
      this.emit(protocol.PLAYER_BUZZ)
    })
    socket.on('quiz_leave', () => {
      this.emit(protocol.PLAYER_LEAVE)
    })
    socket.on('disconnect', (reason) => {
      this.emit(protocol.PLAYER_DISCONNECT, reason)
    })
  }
}

module.exports = Player
