import Joi from 'joi'
import { OBJECT_ID_MESSAGE, OBJECT_ID_RULE } from '~/utils/validator'

const MESSAGE_COLLECTION_NAME = 'message'
const MESSAGE_COLLECTTION_SCHEMA = Joi.object({
  sender:Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_MESSAGE),
  content:Joi.string().trim().strict(),
  chat:Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_MESSAGE),
  createdAt:Joi.date().timestamp('javascript').default(Date.now()),
  updatedAt:Joi.date().timestamp('javascript').default(Date.now()),
  _destroy:Joi.boolean().default(false)
})

export const messageModel ={
  MESSAGE_COLLECTION_NAME,
  MESSAGE_COLLECTTION_SCHEMA
}