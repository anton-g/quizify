const http = require('http').createServer()
const io = require('socket.io')(http)
const nanoid = require('nanoid')
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
    ack(quizes.hasOwnProperty(quizId))
  }

  function onQuizJoin (quizId, userName, ack) {
    let user = {
      name: userName,
      id: nanoid(),
      sid: socket.id,
      connected: true,
      score: 0
    }

    let quiz = quizes[quizId]
    if (!quiz) {
      ack(false)
      debugging && console.log(`${user.name} tried to join non existing quiz ${quizId}`)
      return
    }

    socket.on('buzz', onBuzz)
    socket.on('quiz_leave', onQuizLeave)
    socket.on('disconnect', onDisconnect)

    const previousQuiz = socketQuizes[socket.id]
    if (previousQuiz) {
      const idx = quiz.players.findIndex(m => m.id === user.id)
      quiz.players.splice(idx, 1)

      debugging && console.log(`remove user ${user.name} (${user.id}) from quiz ${quizId}`)
    }

    socket.join(quiz.id)
    socketQuizes[socket.id] = quiz.id

    quiz.players.push(user)

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
      const idx = quiz.players.findIndex(m => m.id === user.id)
      quiz.players.splice(idx, 1)
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
    debugging && console.log(`created quiz ${quizId}`)

    function onQuizStart () {
      quiz.started = true
      io.sockets.in(quizId).emit('start_quiz')

      debugging && console.log(`Quiz host started quiz ${quizId}`)
    }

    function onDisconnect () {
      io.sockets.in(quizId).emit('pause')

      debugging && console.log(`Quiz host disconnected`)
    }

    function onQuizResume () {
      quiz.paused = false
      io.sockets.in(quizId).emit('quiz_resume')
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
    }
  }

  debugging && console.log(`user connected`)
}
