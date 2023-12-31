import jwt from 'jsonwebtoken'
import { env } from './environment'

export const generateToken = (id) => {
  return jwt.sign({ id }, env.JWT_SECRET, {
    expiresIn:'5d'
  })
}