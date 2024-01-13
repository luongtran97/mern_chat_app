import express from 'express'
import { messageController } from '~/controllers/messageController'
import { protect } from '~/middlewares/authMiddlleware'

const Router = express.Router()

Router.route('/')
  .post(protect, messageController.sendMessage)
Router.route('/:chatId')
  .get(protect, messageController.getMessageByChatId)
export const messageRoute = Router