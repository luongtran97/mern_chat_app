import { StatusCodes } from 'http-status-codes'
import { chatModel } from '~/models/chatModel'

const accessChat = async(req) => {
  try {
    const { userId } = req.body
    if (!userId) {
      return (StatusCodes.BAD_REQUEST)
    }
    return await chatModel.accessChat(req)
  } catch (error) {
    throw error
  }
}
const fetchChats = async(req) => {
  try {
    return await chatModel.fetchChats(req)
  } catch (error) {
    throw error
  }
}
const createGroupChat = async(req, users) => {
  try {
    return await chatModel.createGroupChat(req, users)
  } catch (error) {
    throw error
  }
}
export const chatService = {
  accessChat,
  fetchChats,
  createGroupChat
}