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
      connected: true
    }

    let quiz = quizes[quizId]
    if (quiz) {
      const connectedQuiz = socketQuizes[socket.id]
      if (connectedQuiz) {
        const idx = quiz.players.findIndex(m => m.id === user.id)
        quiz.players.splice(idx, 1)

        debugging && console.log(`remove replaced user ${userName} (${user.id}) from quiz ${quizId}`)
      }

      socket.join(quiz.id)
      socketQuizes[socket.id] = quiz.id

      quiz.players.push(user)

      io.sockets.in(quiz.id).emit('users_update', quiz.players)
      ack(true, user)

      debugging && console.log(`${userName} (${user.id}) joined quiz ${quizId}`)

      socket.on('buzz', () => {
        io.sockets.in(quizId).emit('pause')
        socket.to(quiz.owner).emit('user_buzz', userName)

        debugging && console.log(`${userName} buzzed`)
      })
      socket.on('quiz_leave', () => {
        const idx = quiz.players.findIndex(m => m.id === user.id)
        quiz.players.splice(idx, 1)
        io.sockets.in(quiz.id).emit('users_update', quiz.players)

        debugging && console.log(`${userName} left quiz ${quiz.id}`)
      })
      socket.on('disconnect', () => {
        const idx = quiz.players.findIndex(m => m.id === user.id)
        quiz.players[idx].connected = false
        io.sockets.in(quizId).emit('users_update', quiz.players)

        debugging && console.log(`Quiz participant ${userName} disconnected`)
      })
    } else {
      ack(false)

      debugging && console.log(`${userName} tried to join non existing quiz ${quizId}`)
    }
  }

  function onQuizCreate (ack) {
    const quizId = generate('23456789ABCDEFGHJKLMNPQRSTUVWXYZ', 6)
    socket.join(quizId)

    quizes[quizId] = {
      id: quizId,
      owner: socket.id,
      players: []
    }
    ack(quizId)

    socket.on('disconnect', () => {
      io.sockets.in(quizId).emit('pause')

      debugging && console.log(`Quiz host disconnected`)
    })

    socket.on('unpause', () => {
      io.sockets.in(quizId).emit('unpause')
    })

    debugging && console.log(`created quiz ${quizId}`)
  }

  debugging && console.log(`user connected`)
}
