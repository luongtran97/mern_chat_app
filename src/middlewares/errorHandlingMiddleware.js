import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'

// xử lý lỗi tập trung trong ứng dụng BE
// eslint-disable-next-line no-unused-vars
export const errorHandlingMiddleWare = (err, req, res, next) => {

  // nếu dev không cẩn thận thiếu status code thì mặc định sẽ là 500
  if (!err.statusCode) err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR

  // tạo một biến response Error để kiểm soát những gì muốn trả về
  const responseError = {
    statusCode: err.statusCode,
    message:err.message || StatusCodes[err.statusCode],
    stack: err.stack
  }

  // chỉ trong môi trường dev thì mới trả về stack trace để thuận tiện cho việc debug
  if (env.BUILD_MODE !== 'dev') delete responseError.stack

  res.status(responseError.statusCode).json(responseError)
}
