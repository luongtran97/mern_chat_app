//chat name
//isGroupChat
//users
//lastestMessage
//groupAdim
import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_MESSAGE, OBJECT_ID_RULE } from '~/utils/validator'
import { usersModel } from './userModel'
import { messageModel } from './messageModel'

const CHAT_COLLECTION_NAME = 'chat'
const CHAT_COLLECTTION_SCHEMA = Joi.object({
  chatName:Joi.string().required().trim().strict(),
  isGroupChat:Joi.boolean().default(false),
  users:Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_MESSAGE)).default([]),
  lastestMessage:Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_MESSAGE)).default([]),
  groupAdmin:Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_MESSAGE),
  createdAt:Joi.date().timestamp('javascript').default(Date.now()),
  updatedAt:Joi.date().timestamp('javascript').default(Date.now()),
  _destroy:Joi.boolean().default(false)
})
const validateBeforeCreate = async(data) => {
  return await CHAT_COLLECTTION_SCHEMA.validateAsync(data, { abortEarly:false })
}
const accessChat = async(req) => {
  // let isChat = await GET_DB().collection(CHAT_COLLECTION_NAME).find({
  //   isGroupChat:false,
  //   $and: [
  //     { users: { $elemMatch:{ $eq:req.user_id } } },
  //     { users: { $elemMatch:{ $eq:req.user_id } } }
  //   ]
  // }).toArray()

  const data = {
    chatName:'sender',
    users:[req.user._id, new ObjectId(req.body.userId)]
  }
  const validData = await validateBeforeCreate(data)
  try {
    const createdChat = await GET_DB().collection(CHAT_COLLECTION_NAME).insertOne(validData)
    const fullChat = await GET_DB().collection(CHAT_COLLECTION_NAME).aggregate([
      { $match: {
        _id:new ObjectId(createdChat.insertedId),
        _destroy:false
      } },
      {
        $lookup: {
          from: usersModel.USER_COLLECTION_NAME,
          localField:'users._id',
          foreignField:'_id',
          as:'users'
        }
      }
    ]).toArray()
    return fullChat
  } catch (error) {
    throw new Error(error)
  }
}
export const chatModel ={
  CHAT_COLLECTION_NAME,
  CHAT_COLLECTTION_SCHEMA,
  accessChat
}
