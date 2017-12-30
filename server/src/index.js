const http = require('http').createServer()
const io = require('socket.io')(http)
const Server = require('./Server')

const server = new Server(io)
console.log(!!(server))
const port = process.env.PORT || 8081
http.listen(port, () => { console.log(`listening on *:${port}`) })
