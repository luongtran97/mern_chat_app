import express from 'express'
import { userController } from '~/controllers/userController'
import { userValidation } from '~/validations/userValidation'

const Router = express.Router()

Router.route('/login')
  .post(userValidation.login, userController.login)
Router.route('/signUp')
  .post(userValidation.signUp, userController.signUp)
export const userRoute = Router