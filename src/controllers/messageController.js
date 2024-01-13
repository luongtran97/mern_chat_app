import { StatusCodes } from 'http-status-codes'
import { messageService } from '~/services/messageService'

const sendMessage = async(req, res, next) => {
  const { content, chatId } = req.body

  if ( !content || !chatId) {
    res.send(StatusCodes.BAD_REQUEST)
  }
  try {
    const data = await messageService.sendMessage(req, res)
    return res.status(StatusCodes.CREATED).json(data)
  } catch (error) {
    next(error)
  }
}
const getMessageByChatId = async(req, res, next) => {
  try {
    const data = await messageService.getMessageByChatId(req, res)
    return res.status(StatusCodes.CREATED).json(data)
  } catch (error) {
    next(error)
  }
}
export const messageController = {
  sendMessage,
  getMessageByChatId
}