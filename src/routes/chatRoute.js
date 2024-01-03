import express from 'express'
import { chatController } from '~/controllers/chatController'
import { protect } from '~/middlewares/authMiddlleware'

const Router = express.Router()

Router.route('/')
  .post(protect, chatController.accessChat)
  .get(protect, chatController.fetchChats)
Router.route('/group')
  .post(protect, chatController.createGroupChat)

export const chatRoute = Router