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

export const chatController = {
  accessChat
}