/**
 * Định nghĩa riêng một class apierror kế thừa từ class Error sẵn
 */
class ApiError extends Error {
  constructor(statusCode, message) {
    // gọi tới hàm khởi tạo của class Error cha dùng this
    super(message)

    //tên của cái custom Error này
    this.name = 'ApiError'

    //gán thêm http status code vào đây
    this.statusCode = statusCode

    // ghi lại Stack Trace để thuận tiện việc debug
    Error.captureStackTrace(this, this.contructor)
  }
}
export default ApiError