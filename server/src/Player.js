`use strict`

const User = require('./User')
const protocol = require('./protocol')

class Player extends User {
  constructor (socket, name) {
    super (socket)

    this.name = name
    this.score = 0

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

  scored (score) {
    this.score += score
    console.log(score)
    this.socket.emit('quiz_scored', score)
  }

  lost () {
    this.socket.emit('quiz_ended', false)
  }

  won () {
    this.socket.emit('quiz_ended', true)
  }
}

module.exports = Player
