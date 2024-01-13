import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { userRoute } from '~/routes/usersRoute'
import { chatRoute } from './chatRoute'
import { messageRoute } from './messageRoute'

const Router = express.Router()
// checlApi v1 status
Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message:'Api are ready to use' })
})
Router.use('/user', userRoute)
Router.use('/chat', chatRoute)
Router.use('/message', messageRoute)


export const Api = Router