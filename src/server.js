import express from 'express'
import { env } from '~/config/environment'
import cors from 'cors'
import { corsOptions } from '~/config/cors'
import { CLOSE_DB, CONNECT_DB } from './config/mongodb'
import { Api } from '~/routes'
import { errorHandlingMiddleWare } from '~/middlewares/errorHandlingMiddleware'
import exitHook from 'async-exit-hook'
import { Server as SocketIOServer } from 'socket.io'
import { WHITELIST_DOMAINS } from './utils/constant'
const START_SERVER = () => {
  const app = express()
  // const server = createServer(app)
  app.use(cors(corsOptions))
  app.use(express.json())
  app.use('/api', Api)
  // xử lý lỗi tập trung
  app.use(errorHandlingMiddleWare)
  const sever = app.listen(env.LOCAL_DEV_APP_PORT, () => { console.log(`Hi I'm LuongTrandev running backend at port ${env.LOCAL_DEV_APP_PORT}`)})
  exitHook(() => {
    CLOSE_DB()
  })
  const io = new SocketIOServer(sever, {
    pingTimeout: 60000,
    cors: {
      origin: WHITELIST_DOMAINS
    }
  })
  // emit gửi sự kiện
  // on bắt sự kiện
  // join(room) tham gia một phòng cụ thể
  // to(room).emit(event, data) gửi sự kiện đén các người dùng trong một phòng
  io.on('connection', (socket) => {
    // kết nối tới socket

    socket.on('setup', (userData) => {
      // tham gia 1 room
      socket.join(userData._id)
      socket.emit('connected')
    })

    socket.on('join chat', (room) => {
      socket.join(room)
    })

    socket.on('typing', (room) => { socket.in(room).emit('typing') })
    socket.on('stop typing', (room) => { socket.in(room).emit('stop typing') })

    socket.on('new message', (newMessageRecieved) => {
      var chat = newMessageRecieved.chat
      if (!chat.users) return
      chat.users.forEach((user) => {
        if (user._id === newMessageRecieved.sender[0]._id) return
        socket.in(user._id).emit('message recieved', newMessageRecieved)
      })
    })
  })
}
// khi kết nối tới mongo thành công sẽ start server
CONNECT_DB()
  .then(() => { START_SERVER() })
  .catch(() => {})