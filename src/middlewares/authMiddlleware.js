import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import { env } from '~/config/environment'
import { usersModel } from '~/models/userModel'

export const protect = async(req, res, next) => {
  let token

  if ( req.headers.authorization ) {
    try {
      if ( req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
      } else {
        token = req.headers.authorization
      }
      // decode token
      const decode = jwt.verify(token, env.JWT_SECRET)

      req.user = await usersModel.findOneById(decode.id)
      next()
    } catch (error) {
      res.status(StatusCodes.UNAUTHORIZED)
      throw new Error('Not authorized!')
    }
  }
  if (!token) {
    res.status(StatusCodes.UNAUTHORIZED)
    throw new Error('Not authorized!')
  }
}