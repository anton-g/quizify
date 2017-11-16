const http = require('http').createServer()
const io = require('socket.io')(http)
const generate = require('nanoid/generate')

const debugging = process.env.DEBUG

io.on('connection', onConnection)
const port = process.env.PORT || 8081
http.listen(port, () => { console.log(`listening on *:${port}`) })

let rooms = {}

function onConnection (socket) {
  socket.on('room_verify_key', onRoomVerifyKey)
  socket.on('room_join', onRoomJoin)
  socket.on('room_create', onRoomCreate)

  function onRoomVerifyKey (roomId, ack) {
    let room = rooms[roomId]
    ack(!!(room))
  }

  function onRoomJoin (roomId, userName, ack) {
    let room = rooms[roomId]
    if (room) {
      socket.join(room.id)

      let user = {
        name: userName,
        id: socket.id,
        connected: true
      }

      room.members.push(user)

      io.sockets.in(roomId).emit('users_update', room.members)

      socket.on('buzz', () => {
        debugging && console.log(`${userName} buzzed`)
        io.sockets.in(roomId).emit('pause')
        socket.to(room.owner).emit('user_buzz', userName)
      })
      ack(true, user)

      debugging && console.log(`${userName} joined room ${roomId}`)

      socket.on('disconnect', () => {
        const idx = room.members.findIndex(m => m.id === user.id)
        room.members[idx].connected = false
        io.sockets.in(roomId).emit('users_update', room.members)

        debugging && console.log(`Room participant ${userName} disconnected`)
      })
    } else {
      ack(false)

      debugging && console.log(`${userName} tried to join room ${roomId}`)
    }
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

  debugging && console.log(`user connected`)
}
