const http = require('http').createServer()
const io = require('socket.io')(http)
const generate = require('nanoid/generate')

const debugging = process.env.DEBUG

io.on('connection', onConnection)
const port = process.env.PORT || 8081
http.listen(port, () => { console.log(`listening on *:${port}`) })

let rooms = []

function onConnection (socket) {
  const name = socket.handshake.query.name || 'host'
  debugging && console.log(`${name} connected`)

  socket.on('room_join', onRoomJoin)
  socket.on('room_create', onRoomCreate)

  let currentRoom = {}

  function onRoomJoin (roomId) {
    let room = rooms.find(r => r.id === roomId)
    if (room) {
      debugging && console.log(`${name} joined room ${roomId}`)
      socket.join(room.id)
      currentRoom = room

      socket.to(room.ownerSocket).emit('user_join', name)
    }

    socket.on('disconnect', () => {
      debugging && console.log(`Room participant ${name} disconnected`)
      socket.to(room.ownerSocket).emit('user_leave', name)
    })

    socket.on('buzz', () => {
      debugging && console.log(`${name} buzzed`)
      io.sockets.in(currentRoom.id).emit('pause')
      socket.to(room.ownerSocket).emit('user_buzz', name)
    })
  }

  function onRoomCreate (ack) {
    const roomId = generate('23456789ABCDEFGHJKLMNPQRSTUVWXYZ', 6)
    debugging && console.log(`created room ${roomId}`)
    socket.join(roomId)

    rooms.push({
      id: roomId,
      ownerSocket: socket.id
    })
    ack(roomId)

    socket.on('disconnect', () => {
      debugging && console.log(`Room host disconnected`)
      io.sockets.in(roomId).emit('pause')
    })

    socket.on('unpause', () => {
      io.sockets.in(roomId).emit('unpause')
    })
  }
}
