import express from 'express'
import { chatController } from '~/controllers/chatController'
import { protect } from '~/middlewares/authMiddlleware'

const Router = express.Router()

Router.route('/')
  .post(protect, chatController.accessChat)
  .get(protect, chatController.fetchChats)
Router.route('/group')
  .post(protect, chatController.createGroupChat)
Router.route('/rename')
  .put(protect, chatController.renameGroup)
Router.route('/groupadd')
  .put(protect, chatController.addToGroup)
Router.route('/groupremove')
  .put(protect, chatController.removeFromGroup)
export const chatRoute = Router