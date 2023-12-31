import { generateToken } from '~/config/generateToken'
import { usersModel } from '~/models/userModel'
import bcrypt from 'bcrypt'
const login = async(reqBody) => {
  try {
    const findUser = await usersModel.login(reqBody)
    if (findUser) {
      const checkPassword = await bcrypt.compare(reqBody.password, findUser.password)
      if (checkPassword) {
        delete findUser.password
        const result = { ...findUser, token:generateToken(findUser._id) }
        return result
      } else {
        return { loginResult:'Incorrect Password!' }
      }
    } else {
      return { loginResult:'Incorrect Email!' }
    }
  } catch (error) {
    throw error
  }
}
const signUp = async(reqBody) => {
  try {
    const checkUser = await usersModel.checkUserExisting(reqBody.email)
    if (checkUser) {
      return { signUpResult:'Email has already exited!' }
    }
    const createUser = await usersModel.signUp(reqBody)
    const getUser = await usersModel.findOneById(createUser.insertedId)
    const response = { _id:getUser._id, name:getUser.name, email:getUser.email, picture:getUser.picture, token:generateToken(getUser._id) }
    return response
  } catch (error) {
    throw error
  }
}
export const userService = {
  login,
  signUp
}