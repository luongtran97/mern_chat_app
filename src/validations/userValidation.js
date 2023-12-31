import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import ApiError from '~/utils/ApiError'
import {
  OBJECT_EMAIL_MESSAGE,
  OBJECT_EMAIL_RULE,
  OBJECT_PASSWORD_MESSAGE,
  OBJECT_PASSWORD_RULE
} from '~/utils/validator'

const login = async(req, res, next) => {
  const correctCondition = Joi.object({
    email:Joi.string().required()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }) // Enforcing at least two domain segments and specific TLDs
      .max(100) // Setting a maximum length for the email
      .pattern(OBJECT_EMAIL_RULE)
      .message(OBJECT_EMAIL_MESSAGE),
    password: Joi.string().required().pattern(OBJECT_PASSWORD_RULE).message(OBJECT_PASSWORD_MESSAGE)
  })
  // sau khi valid xong trả về, hợp lệ thì request tiếp sang controller
  next()
  try {
    await correctCondition.validateAsync(req.body, { abortEarly:false })
  } catch (error) {
    const errorMessage = new Error(error).message
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(customError)
  }
}
const signUp = async(req, res, next) => {
  const correctCondition = Joi.object({
    name:Joi.string().required().min(3).max(30).trim().strict(),
    email:Joi.string().required()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }) // Enforcing at least two domain segments and specific TLDs
      .max(100) // Setting a maximum length for the email
      .pattern(OBJECT_EMAIL_RULE)
      .message(OBJECT_EMAIL_MESSAGE),
    password: Joi.string().required().pattern(OBJECT_PASSWORD_RULE).message(OBJECT_PASSWORD_MESSAGE),
    picture:Joi.string().trim().strict().default('https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg')
  })
  // sau khi valid xong trả về, hợp lệ thì request tiếp sang controller
  next()
  try {
    await correctCondition.validateAsync(req.body, { abortEarly:false })
  } catch (error) {
    const errorMessage = new Error(error).message
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage)
    next(customError)
  }
}
export const userValidation = {
  login,
  signUp
}