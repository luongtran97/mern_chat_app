import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import {
  OBJECT_EMAIL_MESSAGE,
  OBJECT_EMAIL_RULE,
  OBJECT_PASSWORD_MESSAGE,
  OBJECT_PASSWORD_RULE
} from '~/utils/validator'
import bcrypt from 'bcrypt'

const USER_COLLECTION_NAME = 'users'
const USER_COLLECTTION_SCHEMA = Joi.object({
  name:Joi.string().required().min(3).max(30).trim().strict(),
  email:Joi.string().required()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }) // Enforcing at least two domain segments and specific TLDs
    .max(100) // Setting a maximum length for the email
    .pattern(OBJECT_EMAIL_RULE)
    .message(OBJECT_EMAIL_MESSAGE),
  password:Joi.string().min(8).max(10).pattern(OBJECT_PASSWORD_RULE).message(OBJECT_PASSWORD_MESSAGE).required().trim().strict(),
  picture:Joi.string().trim().strict().default('https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'),
  createdAt:Joi.date().timestamp('javascript').default(Date.now),
  updatedAt:Joi.date().timestamp('javascript').default(null),
  _destroy:Joi.boolean().default(false)
})
const validateBeforeCreate = async(data) => {
  return await USER_COLLECTTION_SCHEMA.validateAsync(data, { abortEarly:false })
}
const findOneById = async(id) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
    return result
  } catch (error) {
    throw new Error(error)
  }
}
const login = async(data) => {
  try {
    const findUser = await GET_DB().collection(USER_COLLECTION_NAME).findOne({ email: data.email })
    // if ( findUser ) {
    //   const checkPass = await
    // }
    return findUser
  } catch (error) {
    throw new Error(error)
  }
}
const signUp = async(data) => {
  const validData = await validateBeforeCreate(data)
  const { name, email, password } = data
  if (!name || !email || !password) {
    throw new Error('Please enter all the fields!')
  }
  try {
    const hashPassword = bcrypt.hashSync(validData.password, 10)
    const result = await GET_DB().collection(USER_COLLECTION_NAME).insertOne({ ...validData, password:hashPassword })
    return result
  } catch (error) {
    throw new Error(error)
  }
}
const checkUserExisting = async(email) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({ email })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const usersModel ={
  USER_COLLECTION_NAME,
  USER_COLLECTTION_SCHEMA,
  findOneById,
  login,
  signUp,
  checkUserExisting
}
