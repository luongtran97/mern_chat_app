import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_MESSAGE, OBJECT_ID_RULE } from '~/utils/validator'
import { chatModel } from './chatModel'
import { usersModel } from './userModel'
const MESSAGE_COLLECTION_NAME = 'message'
const MESSAGE_COLLECTTION_SCHEMA = Joi.object({
  sender:Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_MESSAGE),
  content:Joi.string().trim().strict(),
  chat:Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_MESSAGE),
  createdAt:Joi.date().timestamp('javascript').default(Date.now()),
  updatedAt:Joi.date().timestamp('javascript').default(Date.now()),
  _destroy:Joi.boolean().default(false)
})
const validateBeforeCreate = async(data) => {
  return await MESSAGE_COLLECTTION_SCHEMA.validateAsync(data, { abortEarly:false })
}
const sendMessage = async(req, res) => {
  const { content, chatId } = req.body

  let newMessage = {
    sender: req.user._id.toString(),
    content,
    chat: chatId
  }
  const validData = await validateBeforeCreate(newMessage)
  const dataToAdd = { ... validData, sender: new ObjectId(validData.sender), chat: new ObjectId(validData.chat) }

  try {
    const newMessageAdd = await GET_DB().collection(MESSAGE_COLLECTION_NAME).insertOne(dataToAdd)
    // update latest message
    await GET_DB().collection(chatModel.CHAT_COLLECTION_NAME).updateOne(
      { _id: new ObjectId(validData.chat) },
      { $set: { lastestMessage: new ObjectId (newMessageAdd.insertedId) } }
    )
    const fullMessage = await GET_DB().collection(MESSAGE_COLLECTION_NAME).aggregate([
      { $match: {
        _id: new ObjectId(newMessageAdd.insertedId),
        _destroy:false
      } },
      {
        $lookup :{
          from : chatModel.CHAT_COLLECTION_NAME,
          localField:'chat',
          foreignField:'_id',
          as:'chat'
        }
      },
      {
        $lookup: {
          from: usersModel.USER_COLLECTION_NAME,
          localField: 'sender',
          foreignField: '_id',
          as: 'sender'
        }
      },
      {
        $project:{
          'sender.password':0
        }
      },
      {
        $unwind: '$chat'
      },
      {
        $lookup: {
          from: usersModel.USER_COLLECTION_NAME,
          localField: 'chat.users',
          foreignField: '_id',
          as: 'chat.users'
        }
      },
      {
        $project:{
          'chat.users.password': 0
        }
      }
    ]).toArray()
    return fullMessage[0]
  } catch (error) {
    throw new Error(error)
  }
}
const getMessageByChatId = async(req, res) => {
  const { chatId } = req.params
  try {
    const data = await GET_DB().collection(MESSAGE_COLLECTION_NAME).aggregate([
      { $match: {
        chat : new ObjectId (chatId)
      } },
      {
        $lookup : {
          from: usersModel.USER_COLLECTION_NAME,
          localField:'sender',
          foreignField:'_id',
          as:'sender'
        }
      },
      {
        $project:{
          'sender.password':0
        }
      },
      {
        $lookup: {
          from:chatModel.CHAT_COLLECTION_NAME,
          localField:'chat',
          foreignField:'_id',
          as:'chat'
        }
      },
      {
        $unwind: '$chat'
      },
      {
        $lookup: {
          from: usersModel.USER_COLLECTION_NAME,
          localField: 'chat.users',
          foreignField: '_id',
          as: 'chat.users'
        }
      },
      {
        $project:{
          'chat.users.password': 0
        }
      }
    ]).toArray()
    return data
  } catch (error) {
    throw new Error(error)
  }
}
export const messageModel ={
  MESSAGE_COLLECTION_NAME,
  MESSAGE_COLLECTTION_SCHEMA,
  sendMessage,
  getMessageByChatId
}