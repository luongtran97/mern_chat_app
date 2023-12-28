import express from 'express'
import { env } from '~/config/environment'
const app = express()
app.listen(env.LOCAL_DEV_APP_PORT, () => { console.log(`Hi I'm LuongTrandev running backend at port ${env.LOCAL_DEV_APP_PORT}`)})