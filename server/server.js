const http = require('http').createServer()
const io = require('socket.io')(http)
const generate = require('nanoid/generate')

const debugging = process.env.DEBUG

io.on('connection', onConnection)
const port = process.env.PORT || 8081
http.listen(port, () => { console.log(`listening on *:${port}`) })

let rooms = {}

function onConnection (socket) {
  const name = socket.handshake.query.name || 'host'
  debugging && console.log(`${name} connected`)

  socket.on('room_join', onRoomJoin)
  socket.on('room_create', onRoomCreate)

  function onRoomJoin (roomId) {
    let room = rooms[roomId]
    if (room) {
      socket.join(room.id)

      socket.to(room.owner).emit('user_join', name)
      room.members.push(name)

      socket.on('buzz', () => {
        debugging && console.log(`${name} buzzed`)
        io.sockets.in(roomId).emit('pause')
        socket.to(room.owner).emit('user_buzz', name)
      })

      debugging && console.log(`${name} joined room ${roomId}`)
    } else {
      // could not find room
    }

    socket.on('disconnect', () => {
      socket.to(room.owner).emit('user_leave', name)
      room.members.splice(room.members.findIndex(m => m === name), 1)

      debugging && console.log(`Room participant ${name} disconnected`)
    })
  }

  function onRoomCreate (ack) {
    const roomId = generate('23456789ABCDEFGHJKLMNPQRSTUVWXYZ', 6)
    socket.join(roomId)

    rooms[roomId] = {
      id: roomId,
      owner: socket.id,
      members: []
    }
    ack(roomId)

    socket.on('disconnect', () => {
      io.sockets.in(roomId).emit('pause')

      debugging && console.log(`Room host disconnected`)
    })

    socket.on('unpause', () => {
      io.sockets.in(roomId).emit('unpause')
    })

    debugging && console.log(`created room ${roomId}`)
  }
}
