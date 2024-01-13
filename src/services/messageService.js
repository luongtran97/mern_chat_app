import { messageModel } from '~/models/messageModel'

const sendMessage = async(req, res) => {
  try {
    return await messageModel.sendMessage(req, res)
  } catch (error) {
    throw error
  }
}
const getMessageByChatId = async(req, res) => {
  try {
    return await messageModel.getMessageByChatId(req, res)
  } catch (error) {
    throw error
  }
}
export const messageService = {
  sendMessage,
  getMessageByChatId
}