import Joi from 'joi'

const MESSAGE_COLLECTION_NAME = 'message'
const MESSAGE_COLLECTTION_SCHEMA = Joi.object({
  name:Joi.string().required().trim().strict(),
  email:Joi.string().required().trim().strict(),
  password:Joi.string().required().trim().strict(),
  picture:Joi.string().required().trim().strict().default('https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'),
  createdAt:Joi.date().timestamp('javascript').default(Date.now()),
  updatedAt:Joi.date().timestamp('javascript').default(Date.now()),
  _destroy:Joi.boolean().default(false)
})

export const chatModel ={
  MESSAGE_COLLECTION_NAME,
  MESSAGE_COLLECTTION_SCHEMA
}