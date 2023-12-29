//chat name
//isGroupChat
//users
//lastestMessage
//groupAdim
import Joi from 'joi'
import { OBJECT_ID_MESSAGE, OBJECT_ID_RULE } from '~/utils/validator'

const CHAT_COLLECTION_NAME = 'chat'
const CHAT_COLLECTTION_SCHEMA = Joi.object({
  chatName:Joi.string().required().trim().strict(),
  isGroupChat:Joi.boolean().default(false),
  users:Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_MESSAGE)).default([]),
  lastestMessage:Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_MESSAGE)).default([]),
  groupAdmin:Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_MESSAGE),
  createdAt:Joi.date().timestamp('javascript').default(Date.now()),
  updatedAt:Joi.date().timestamp('javascript').default(Date.now()),
  _destroy:Joi.boolean().default(false)
})

export const chatModel ={
  CHAT_COLLECTION_NAME,
  CHAT_COLLECTTION_SCHEMA
}