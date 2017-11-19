const http = require('http').createServer()
const io = require('socket.io')(http)
const generate = require('nanoid/generate')

const debugging = process.env.DEBUG

io.on('connection', onConnection)
const port = process.env.PORT || 8081
http.listen(port, () => { console.log(`listening on *:${port}`) })

let rooms = {}
let socketRooms = {}

function onConnection (socket) {
  socket.on('room_verify_key', onRoomVerifyKey)
  socket.on('room_join', onRoomJoin)
  socket.on('room_create', onRoomCreate)

  function onRoomVerifyKey (roomId, ack) {
    let room = rooms[roomId]
    ack(!!(room))
  }

  function onRoomJoin (roomId, userName, ack) {
    let user = {
      name: userName,
      id: socket.id,
      connected: true
    }

    let room = rooms[roomId]
    if (room) {
      const connectedRoom = socketRooms[socket.id]
      if (connectedRoom) {
        const idx = room.members.findIndex(m => m.id === user.id)
        room.members.splice(idx, 1)

        debugging && console.log(`remove replaced user ${userName} (${user.id}) from room ${roomId}`)
      }

      socket.join(room.id)
      socketRooms[socket.id] = room.id

      room.members.push(user)

      io.sockets.in(room.id).emit('users_update', room.members)
      ack(true, user)

      debugging && console.log(`${userName} (${user.id}) joined room ${roomId}`)

      socket.on('buzz', () => {
        io.sockets.in(roomId).emit('pause')
        socket.to(room.owner).emit('user_buzz', userName)

        debugging && console.log(`${userName} buzzed`)
      })
      socket.on('room_leave', () => {
        const idx = room.members.findIndex(m => m.id === user.id)
        room.members.splice(idx, 1)
        io.sockets.in(room.id).emit('users_update', room.members)

        debugging && console.log(`${userName} left room ${room.id}`)
      })
      socket.on('disconnect', () => {
        const idx = room.members.findIndex(m => m.id === user.id)
        room.members[idx].connected = false
        io.sockets.in(roomId).emit('users_update', room.members)

        debugging && console.log(`Room participant ${userName} disconnected`)
      })
    } else {
      ack(false)

      debugging && console.log(`${userName} tried to join non existing room ${roomId}`)
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
