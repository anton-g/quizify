const http = require('http').createServer()
const io = require('socket.io')(http)
const nanoid = require('nanoid')
const generate = require('nanoid/generate')
const store = require('./quizStore')

const debugging = process.env.DEBUG

io.on('connection', onConnection)
const port = process.env.PORT || 8081
http.listen(port, () => { console.log(`listening on *:${port}`) })

let socketQuizes = {}

store.newQuiz()

function onConnection (socket) {
  socket.on('quiz_verify_key', onQuizVerifyKey)
  socket.on('quiz_join', onQuizJoin)
  socket.on('quiz_create', onQuizCreate)

  function onQuizVerifyKey (quizId, ack) {
    ack(store.quizExists(quizId))
  }

  function onQuizJoin (quizId, userName, ack) {
    let user = {
      name: userName,
      id: nanoid(),
      sid: socket.id,
      connected: true,
      score: 0
    }

    let quiz = store.get(quizId)
    if (!quiz) {
      ack(false)
      debugging && console.log(`${user.name} tried to join non existing quiz ${quizId}`)
      return
    }

    socket.on('buzz', onBuzz)
    socket.on('quiz_leave', onQuizLeave)
    socket.on('disconnect', onDisconnect)

    if (socketQuizes[socket.id]) store.removePlayer(quizId, user.id)
    socketQuizes[socket.id] = quiz.id

    socket.join(quiz.id)
    store.addPlayer(quiz.id, user)

    io.sockets.in(quiz.id).emit('users_update', quiz.players)
    ack(true, user)

    debugging && console.log(`${user.name} (${user.id}) joined quiz ${quizId}`)

    function onBuzz () {
      quiz.paused = true
      io.sockets.in(quizId).emit('quiz_pause')
      socket.to(quiz.owner).emit('quiz_buzz', user.id)

      debugging && console.log(`${user.name} buzzed`)
    }

    function onQuizLeave () {
      store.removePlayer(quiz.id, user.id)
      io.sockets.in(quiz.id).emit('users_update', quiz.players)

      debugging && console.log(`${user.name} left quiz ${quiz.id}`)
    }

    function onDisconnect (reason) {
      const idx = quiz.players.findIndex(m => m.id === user.id)
      quiz.players[idx].connected = false
      io.sockets.in(quizId).emit('users_update', quiz.players)

      debugging && console.log(`Quiz participant ${user.name} disconnected: ${reason}`)
    }
  }

  function onQuizCreate (ack) {
    socket.on('quiz_start', onQuizStart)
    socket.on('disconnect', onDisconnect)
    socket.on('quiz_resume', onQuizResume)
    socket.on('quiz_score', onQuizScore)
    socket.on('quiz_end', onQuizEnd)

    const quizId = generate('23456789ABCDEFGHJKLMNPQRSTUVWXYZ', 6)

    let quiz = {
      id: quizId,
      owner: socket.id,
      players: [],
      started: false,
      paused: false
    }
    store.add(quiz)
    socket.join(quiz.id)

    ack(quiz.id)
    debugging && console.log(`created quiz ${quiz.id}`)

    function onQuizStart () {
      quiz.started = true
      io.sockets.in(quiz.id).emit('start_quiz')

      debugging && console.log(`Quiz host started quiz ${quiz.id}`)
    }

    function onDisconnect () {
      io.sockets.in(quiz.id).emit('pause')

      debugging && console.log(`Quiz host disconnected`)
    }

    function onQuizResume () {
      quiz.paused = false
      io.sockets.in(quiz.id).emit('quiz_resume')

      debugging && console.log(`Quiz resumed`)
    }

    function onQuizScore (userId, score) {
      let user = quiz.players.find(p => p.id === userId)
      user.score += score
      socket.to(user.sid).emit('quiz_scored', score)

      debugging && console.log(`user ${user.name} scored ${score}`)
    }

    function onQuizEnd (winnerId) {
      let losers = quiz.players.filter(p => p.id !== winnerId && p.id !== quiz.owner)
      losers.forEach(p => socket.to(p.sid))
      socket.emit('quiz_ended', false)

      const winner = quiz.players.find(p => p.id === winnerId)
      socket.to(winner.sid).emit('quiz_ended', true)

      debugging && console.log(`Quiz ended. Winner was ${winner} (${winner.id})`)
    }
  }

  debugging && console.log(`user connected`)
}
