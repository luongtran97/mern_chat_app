import express from 'express'
import { chatController } from '~/controllers/chatController'
import { protect } from '~/middlewares/authMiddlleware'

const Router = express.Router()

Router.route('/')
  .post(protect, chatController.accessChat)


export const chatRoute = Router