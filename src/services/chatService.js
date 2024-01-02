import { StatusCodes } from 'http-status-codes'
import { chatModel } from '~/models/chatModel'

export const accessChat = async(req) => {
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
export const chatService = {
  accessChat
}