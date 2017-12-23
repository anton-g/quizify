const http = require('http').createServer()
const io = require('socket.io')(http)
const generate = require('nanoid/generate')

const debugging = process.env.DEBUG

io.on('connection', onConnection)
const port = process.env.PORT || 8081
http.listen(port, () => { console.log(`listening on *:${port}`) })

let quizes = {}
let socketQuizes = {}

function onConnection (socket) {
  socket.on('quiz_verify_key', onQuizVerifyKey)
  socket.on('quiz_join', onQuizJoin)
  socket.on('quiz_create', onQuizCreate)

  function onQuizVerifyKey (quizId, ack) {
    let quiz = quizes[quizId]
    ack(!!(quiz))
  }

  function onQuizJoin (quizId, userName, ack) {
    let user = {
      name: userName,
      id: socket.id,
      connected: true,
      score: 0
    }

    let quiz = quizes[quizId]
    if (quiz) {
      const connectedQuiz = socketQuizes[socket.id]
      if (connectedQuiz) {
        const idx = quiz.players.findIndex(m => m.id === user.id)
        quiz.players.splice(idx, 1)

        debugging && console.log(`remove replaced user ${user.name} (${user.id}) from quiz ${quizId}`)
      }

      socket.join(quiz.id)
      socketQuizes[socket.id] = quiz.id

      quiz.players.push(user)

      io.sockets.in(quiz.id).emit('users_update', quiz.players)
      ack(true, user)

      debugging && console.log(`${user.name} (${user.id}) joined quiz ${quizId}`)

      socket.on('buzz', () => {
        quiz.paused = true
        io.sockets.in(quizId).emit('quiz_pause')
        socket.to(quiz.owner).emit('quiz_buzz', user.id)

        debugging && console.log(`${user.name} buzzed`)
      })

      socket.on('quiz_leave', () => {
        const idx = quiz.players.findIndex(m => m.id === user.id)
        quiz.players.splice(idx, 1)
        io.sockets.in(quiz.id).emit('users_update', quiz.players)

        debugging && console.log(`${user.name} left quiz ${quiz.id}`)
      })

      socket.on('disconnect', (reason) => {
        const idx = quiz.players.findIndex(m => m.id === user.id)
        quiz.players[idx].connected = false
        io.sockets.in(quizId).emit('users_update', quiz.players)

        debugging && console.log(`Quiz participant ${user.name} disconnected: ${reason}`)
      })
    } else {
      ack(false)

      debugging && console.log(`${user.name} tried to join non existing quiz ${quizId}`)
    }
  }

  function onQuizCreate (ack) {
    const quizId = generate('23456789ABCDEFGHJKLMNPQRSTUVWXYZ', 6)
    socket.join(quizId)

    let quiz = {
      id: quizId,
      owner: socket.id,
      players: [],
      started: false,
      paused: false
    }
    quizes[quizId] = quiz

    ack(quizId)

    socket.on('quiz_start', () => {
      quiz.started = true
      io.sockets.in(quizId).emit('start_quiz')

      debugging && console.log(`Quiz host started quiz ${quizId}`)
    })

    socket.on('disconnect', () => {
      io.sockets.in(quizId).emit('pause')

      debugging && console.log(`Quiz host disconnected`)
    })

    socket.on('quiz_resume', () => {
      quiz.paused = false
      io.sockets.in(quizId).emit('quiz_resume')
    })

    socket.on('quiz_score', (userId, score) => {
      let user = quiz.players.find(p => p.id === userId)
      user.score += score
      socket.to(user.id).emit('quiz_scored', score)

      debugging && console.log(`user ${user.name} scored ${score}`)
    })

    debugging && console.log(`created quiz ${quizId}`)
  }

  debugging && console.log(`user connected`)
}
