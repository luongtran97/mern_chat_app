import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_MESSAGE, OBJECT_ID_RULE } from '~/utils/validator'
import { usersModel } from './userModel'
import { StatusCodes } from 'http-status-codes'
import _ from 'lodash'
import { messageModel } from './messageModel'
const CHAT_COLLECTION_NAME = 'chat'
const CHAT_COLLECTTION_SCHEMA = Joi.object({
  chatName:Joi.string().required().trim().strict(),
  isGroupChat:Joi.boolean().default(false),
  users:Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_MESSAGE)).default([]),
  lastestMessage:Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_MESSAGE).default(null),
  groupAdmin:Joi.object().default(null),
  createdAt:Joi.date().timestamp('javascript').default(Date.now()),
  updatedAt:Joi.date().timestamp('javascript').default(Date.now()),
  _destroy:Joi.boolean().default(false)
})

const validateBeforeCreate = async(data) => {
  return await CHAT_COLLECTTION_SCHEMA.validateAsync(data, { abortEarly:false })
}
const accessChat = async(req) => {
  let isChat = await GET_DB()
    .collection(CHAT_COLLECTION_NAME)
    .aggregate([
      {
        $match: {
          isGroupChat: false,
          users: {
            $all: [
              { $elemMatch: { $eq: new ObjectId(req.user._id) } },
              { $elemMatch: { $eq: new ObjectId(req.body.userId) } }
            ]
          }
        }
      },
      {
        $match: {
          _destroy: false
        }
      },
      {
        $lookup: {
          from: usersModel.USER_COLLECTION_NAME,
          localField: 'users',
          foreignField: '_id',
          as: 'users'
        }
      },
      {
        $project:{
          'users.password':0
        }
      }
    ])
    .toArray()

  //check isChat exits
  if (isChat.length > 0) {
    return isChat[0]
  } else {
    const data = {
      chatName:'sender',
      users:[req.user._id.toString(), req.body.userId]
    }
    if ( req.user._id.toString() === req.body.userId) {
      return { messageResult :'you have to add the same user' }
    }
    const validData = await validateBeforeCreate(data)
    const newChat = {
      ...validData,
      users: validData.users?.map(userId => new ObjectId(userId))
    }
    try {
      const createdChat = await GET_DB().collection(CHAT_COLLECTION_NAME).insertOne(newChat)
      const fullChat = await GET_DB().collection(CHAT_COLLECTION_NAME).aggregate([
        { $match: {
          _id:new ObjectId(createdChat.insertedId),
          _destroy:false
        } },
        {
          $lookup: {
            from: usersModel.USER_COLLECTION_NAME,
            localField:'users',
            foreignField:'_id',
            as:'users'
          }
        },
        {
          $project: {
            'users.password':0
          }
        }
      ]).toArray()
      return fullChat[0]
    } catch (error) {
      throw new Error(error)
    }
  }

}
const fetchChats = async(req) => {
  try {
    const data = await GET_DB().collection(CHAT_COLLECTION_NAME).aggregate([
      { $match: {
        users:  req.user._id
      } },
      {
        $lookup: {
          from: usersModel.USER_COLLECTION_NAME,
          localField:'users',
          foreignField:'_id',
          as:'users'
        }
      },
      {
        $project:{
          'users.password':0
        }
      },
      {
        $lookup : {
          from: messageModel.MESSAGE_COLLECTION_NAME,
          localField:'lastestMessage',
          foreignField:'_id',
          as:'lastestMessage'
        }
      },
      // {
      //   $unwind: '$lastestMessage'
      // },
      {
        $lookup : {
          from: usersModel.USER_COLLECTION_NAME,
          localField: 'lastestMessage.sender',
          foreignField:'_id',
          as:'lastestMessage.sender'
        }
      },
      {
        $project:{
          'lastestMessage.sender.password':0
        }
      }
    ]).toArray()
    return data
  } catch (error) {
    throw new Error(error)
  }
}
const createGroupChat = async(req, users) => {
  req.user = _.omit(req.user, 'password')
  const groupChat = {
    chatName: req.body.name,
    users,
    isGroupChat:true,
    groupAdmin: req.user
  }
  const validData = await validateBeforeCreate(groupChat)
  const newGroupChat = { ...validData, users:validData.users?.map(user => new ObjectId(user)) }
  try {
    const createGroupChat = await GET_DB().collection(CHAT_COLLECTION_NAME).insertOne(newGroupChat)
    const fullGroupChat = await GET_DB().collection(CHAT_COLLECTION_NAME).aggregate([
      { $match: {
        _id:new ObjectId(createGroupChat.insertedId),
        _destroy:false
      } },
      {
        $lookup: {
          from: usersModel.USER_COLLECTION_NAME,
          localField:'users',
          foreignField:'_id',
          as:'users'
        }
      },
      {
        $project:{
          'users.password':0
        }
      }
    ]).toArray()
    return fullGroupChat[0]
  } catch (error) {
    throw new Error(error)
  }

}
const renameGroup = async(req, res) => {
  const { chatId, chatName } = req.body
  await GET_DB().collection(CHAT_COLLECTION_NAME)
    .findOneAndUpdate(
      { _id: new ObjectId(chatId) },
      { $set: { chatName } },
      { returnDocument: 'after' }
    )
  const updatedChat = await GET_DB().collection(CHAT_COLLECTION_NAME)
    .aggregate([
      { $match: { _id: new ObjectId(chatId) } },
      { $lookup: {
        from: usersModel.USER_COLLECTION_NAME,
        localField: 'users',
        foreignField: '_id',
        as: 'users'
      }
      },
      { $project: { 'users.password': 0 } }
    ]).toArray()
  if (!updatedChat) {
    res.status(StatusCodes.NOT_FOUND)
  }
  delete updatedChat[0].groupAdmin.password
  return updatedChat[0]

}
const addToGroup = async(req, res) => {
  const { chatId, userId } = req.body
  await GET_DB().collection(CHAT_COLLECTION_NAME).updateOne(
    { _id: new ObjectId(chatId) },
    { $push: { users: new ObjectId(userId) } }
  )

  const updatedChat = await GET_DB().collection(CHAT_COLLECTION_NAME).aggregate([
    { $match: { _id: new ObjectId(chatId) } },
    {
      $lookup: {
        from: usersModel.USER_COLLECTION_NAME,
        localField: 'users',
        foreignField: '_id',
        as: 'users'
      }
    },
    {
      $project: {
        'users.password': 0
      }
    }
  ]).toArray()
  if (!updatedChat) {
    res.status(StatusCodes.NOT_FOUND)
  }
  return updatedChat[0]

}
const removeFromGroup = async(req, res) => {
  const { chatId, userId } = req.body
  await GET_DB().collection(CHAT_COLLECTION_NAME).updateOne(
    { _id: new ObjectId(chatId) },
    { $pull: { users: new ObjectId(userId) } }
  )

  const updatedChat = await GET_DB().collection(CHAT_COLLECTION_NAME).aggregate([
    { $match: { _id: new ObjectId(chatId) } },
    {
      $lookup: {
        from: usersModel.USER_COLLECTION_NAME,
        localField: 'users',
        foreignField: '_id',
        as: 'users'
      }
    },
    {
      $project: {
        'users.password': 0
      }
    }
  ]).toArray()
  if (!updatedChat) {
    res.status(StatusCodes.NOT_FOUND)
  }
  return updatedChat[0]
}
export const chatModel ={
  CHAT_COLLECTION_NAME,
  CHAT_COLLECTTION_SCHEMA,
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup
}
