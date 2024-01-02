import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/userService'

const login = async(req, res, next) => {
  try {
    // điều hướng sang service xử lý logic
    const data = await userService.login(req.body)
    res.status(StatusCodes.OK).json(data)
  } catch (error) {
    next(error)
  }
}
const signUp = async(req, res, next) => {
  try {
    const data = await userService.signUp(req.body)
    res.status(StatusCodes.CREATED).json(data)
  } catch (error) {
    next(error)
  }
}
const searchUser = async(req, res, next) => {
  try {
    const data = await userService.searchUser(req.query.search)
    res.status(StatusCodes.OK).json(data)
  } catch (error) {
    next(error)
  }
}
export const userController = {
  login,
  signUp,
  searchUser
}