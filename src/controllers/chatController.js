import { StatusCodes } from 'http-status-codes'
import { chatService } from '~/services/chatService'

const accessChat = async(req, res, next) => {
  try {
    const data = await chatService.accessChat(req)
    return res.status(StatusCodes.OK).json(data)
  } catch (error) {
    next(error)
  }
}
const fetchChats = async(req, res, next) => {
  try {
    const data = await chatService.fetchChats(req)
    return res.status(StatusCodes.OK).json(data)
  } catch (error) {
    next(error)
  }
}
const createGroupChat = async(req, res, next) => {

  if (!req.body.users || !req.body.name ) {
    return res.status(StatusCodes.BAD_REQUEST).send({ message:'Plaese fill all the feilds!' })
  }
  let users = JSON.parse(req.body.users)
  if (users.length < 2 ) {
    return res.status(StatusCodes.BAD_REQUEST).send({ message:'Need more than 2 users are required to create a group chat' })
  }
  users.push(req.user._id.toString())

  try {
    const data = await chatService.createGroupChat(req, users)
    return res.status(StatusCodes.CREATED).json(data)
  } catch (error) {
    next(error)
  }
}
const renameGroup = async(req, res, next) => {
  try {
    const data = await chatService.renameGroup(req, res)
    return res.status(StatusCodes.OK).json(data)
  } catch (error) {
    next(error)
  }
}
const addToGroup = async(req, res, next) => {
  try {
    const data = await chatService.addToGroup(req, res)
    return res.status(StatusCodes.OK).json(data)
  } catch (error) {
    next(error)
  }
}
const removeFromGroup = async(req, res, next) => {
  try {
    const data = await chatService.removeFromGroup(req, res)
    return res.status(StatusCodes.OK).json(data)
  } catch (error) {
    next(error)
  }
}
export const chatController = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup
}