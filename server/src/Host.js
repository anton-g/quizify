`use strict`

const User = require('./user')
const protocol = require('./protocol')

class Host extends User {
  constructor (socket) {
    super (socket)

    socket.on('quiz_start', () => this.emit(protocol.QUIZ_START))
    socket.on('quiz_resume', () => this.emit(protocol.QUIZ_RESUME))
    // socket.on('disconnect', onDisconnect)
    socket.on('quiz_score', (playerId, score) => this.emit(protocol.QUIZ_SCORE, playerId, score))
    socket.on('quiz_end', (winnerId) => this.emit(protocol.QUIZ_END, winnerId))
  }
}

module.exports = Host
