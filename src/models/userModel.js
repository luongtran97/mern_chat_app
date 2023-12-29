import Joi from 'joi'
import { OBJECT_PASSWORD_MESSAGE, OBJECT_PASSWORD_RULE } from '~/utils/validator'

const MESSAGE_COLLECTION_NAME = 'message'
const MESSAGE_COLLECTTION_SCHEMA = Joi.object({
  name:Joi.string().required().min(3).max(30).trim().strict(),
  email:Joi.string().required().trim().strict().email(),
  password:Joi.string().min(8).max(10).pattern(OBJECT_PASSWORD_RULE).message(OBJECT_PASSWORD_MESSAGE).required().trim().strict(),
  picture:Joi.string().required().trim().strict().default('https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'),
  createdAt:Joi.date().timestamp('javascript').default(Date.now()),
  updatedAt:Joi.date().timestamp('javascript').default(Date.now()),
  _destroy:Joi.boolean().default(false)
})

export const chatModel ={
  MESSAGE_COLLECTION_NAME,
  MESSAGE_COLLECTTION_SCHEMA
}