import express from 'express'
import { env } from '~/config/environment'
import { chat } from '~/data'
import cors from 'cors'
import { corsOptions } from '~/config/cors'
const app = express()
app.use(cors(corsOptions))
app.get('/', (req, res) => {
  res.send(`Api created by luongtrandev with port ${env.LOCAL_DEV_APP_PORT}`)
})
app.get('/api/chat', (req, res) => {
  res.send(chat)
})
app.get('/api/chat/:id', (req, res) => {
  const id = req.params.id
  const singleChart = chat.find(c => c._id === id)
  if (!singleChart) { res.send(`Not found your input id ${id}, please try again`) }
  res.send(singleChart)
})

app.listen(env.LOCAL_DEV_APP_PORT, () => { console.log(`Hi I'm LuongTrandev running backend at port ${env.LOCAL_DEV_APP_PORT}`)})