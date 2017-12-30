`use strict`

const protocol = require('./protocol')
const Quiz = require('./Quiz')
const Host = require('./Host')
const Player = require('./Player')

class Server {
  constructor (io) {
    this.io = io
    this.quizes = {}

    this.io.on('connection', (socket) => {
      // verify key
      socket.on('quiz_verify_key', (quizId, ack) => {
        ack(this.quizExists(quizId))
      })

      // create
      socket.on('quiz_create', (ack) => {
        const host = new Host(socket)
        const quiz = this.createQuiz(host)
        ack(quiz.id)
      })

      // join
      socket.on('quiz_join', (quizId, username, ack) => {
        if (!this.quizExists(quizId)) {
          ack(false)
          return
        }

        const player = new Player(socket, username)

        const quiz = this.quizes[quizId]
        quiz.addPlayer(player)

        ack(true, {
          name: player.name,
          id: player.id,
          sid: player.socket.id,
          connected: player.connected,
          score: player.score
        })
      })

      // reconnect
    })
  }

  createQuiz (host) {
    let quiz = new Quiz(host)
    console.log('created quiz')

    this.quizes[quiz.id] = quiz

    return quiz
  }

  quizExists (id) {
    return this.quizes.hasOwnProperty(id)
  }
}

module.exports = Server
