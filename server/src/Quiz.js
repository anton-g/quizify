`use strict`

const EventEmitter = require('events')
const generate = require('nanoid/generate')
const protocol = require('./protocol')

class Quiz extends EventEmitter {
  constructor (host) {
    super ()

    this.id = generate('23456789ABCDEFGHJKLMNPQRSTUVWXYZ', 6)
    this.started = false
    this.paused = false
    this.players = []
    this.host = host

    this.host.on(protocol.QUIZ_START, () => this.start())
    this.host.on(protocol.QUIZ_RESUME, () => this.resume())
    this.host.on(protocol.QUIZ_SCORE, (playerId, score) => this.scorePlayer(playerId, score))
    this.host.on(protocol.QUIZ_END, (winnerId) => this.end(winnerId))
    // check for inactivity
  }

  start () {
    this.started = true
    this.players.forEach(p => p.socket.emit('start_quiz'))
  }

  end (winnerId) {
    let losers = this.players.filter(p => p.id !== winnerId && p.id !== this.host.id)
    losers.forEach(p => p.lost())

    const winner = this.players.find(p => p.id === winnerId)
    winner.won()
  }

  pause () {
    this.paused = true
    this.players.forEach(p => p.socket.emit('quiz_pause'))
  }

  resume () {
    this.paused = false
    this.players.forEach(p => p.socket.emit('quiz_resume'))
  }

  addPlayer (player) {
    player.on(protocol.PLAYER_BUZZ, () => this.handleBuzz(player))
    // player.on(protocol.PLAYER_DISCONNECT, () => this.removePlayer(player))

    this.players.push(player)

    this.broadcastUserState()
  }

  removePlayer (player) {
    const idx = this.players.findIndex(p => p.id === player.id)
    this.players.splice(idx, 1)

    this.broadcastUserState()
  }

  scorePlayer (playerId, score) {
    let player = this.players.find(p => p.id === playerId)
    player.scored(score)
  }

  handleBuzz (player) {
    this.pause()

    this.host.socket.emit('quiz_buzz', player.id)
  }

  broadcastUserState () {
    const playerVms = this.players.map(p => {
      return {
        id: p.id,
        name: p.name,
        connected: p.connected
      }
    })

    this.host.socket.emit('users_update', playerVms)
    this.players.forEach(p => p.socket.emit('users_update', playerVms))
  }
}

module.exports = Quiz
