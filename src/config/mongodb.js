import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from './environment'
// khởi tạo đối tượng trelloDatabaseInstace ban đầu là null vì chưa được connect
let mernChatAppDatabaseInstace = null

// khởi tạo 1 đối tượng Client Instace để connect tới mongodb
const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
  serverApi:{
    version:ServerApiVersion.v1,
    strict:true,
    deprecationErrors:true
  }
})

// kết nối tới database
export const CONNECT_DB = async() => {
  // gọi tới mongodb atlas với uri đã khai báo trong thân của clientInstace
  await mongoClientInstance.connect()
  // kết nối thành công thì lấy tên database gán ngược lại vào biến mernChatAppDatabaseInstace
  mernChatAppDatabaseInstace = mongoClientInstance.db(env.DATABASE_NAME)
}


//đóng kết nối tới database khi cần
export const CLOSE_DB = async() => {
  // eslint-disable-next-line no-console
  await mongoClientInstance.close()
}

// func có nhiệm vụ export ra cái mernChatAppDatabaseInstace sau khi đã connect thành công tới mongodb
export const GET_DB = () => {
  if (!mernChatAppDatabaseInstace) throw new Error('must connect to database first!')
  return mernChatAppDatabaseInstace
}