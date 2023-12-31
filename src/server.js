import express from 'express'
import { env } from '~/config/environment'
import cors from 'cors'
import { corsOptions } from '~/config/cors'
import { CLOSE_DB, CONNECT_DB } from './config/mongodb'
import { Api } from '~/routes'
import { errorHandlingMiddleWare } from '~/middlewares/errorHandlingMiddleware'
import exitHook from 'async-exit-hook'
const START_SERVER = () => {
  const app = express()
  app.use(cors(corsOptions))
  app.use(express.json())
  app.use('/api', Api)
  // xử lý lỗi tập trung
  app.use(errorHandlingMiddleWare)
  app.listen(env.LOCAL_DEV_APP_PORT, () => { console.log(`Hi I'm LuongTrandev running backend at port ${env.LOCAL_DEV_APP_PORT}`)})

  exitHook(() => {
    CLOSE_DB()
  })
}
// khi kết nối tới mongo thành công sẽ start server
CONNECT_DB()
  .then(() => { START_SERVER() })
  .catch(() => {})