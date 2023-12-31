import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'
import { WHITELIST_DOMAINS } from '~/utils/constant'

export const corsOptions = {
  origin: function (origin, callback) {
    // cho phép việc gọi API bằng POSTMAN trên môi trường dev
    // thông thường khi sử dụng POSTMAN thì origin trả về undefined
    if (env.BUILD_MODE === 'dev' || undefined) {
      // return call back ở đây là cho đi qua
      return callback(null, true)
    }

    // kiểm tra xem origin có nằm trong whitelist domain hay không
    if (WHITELIST_DOMAINS.includes(origin)) {
      return callback(null, true)
    }

    // cuối cùng nếu domian không được chấp nhận thì trả về lỗi
    return callback(StatusCodes.FORBIDDEN)
  }

}