/**
 * dotenvの読み込みを1箇所に限定するため、
 * 設定ファイルは必ずこのファイルを起点にexport or Re-exportにより提供する
 */

void require('dotenv').config()

export { jwtConfig } from '@src/config/jwt'

export const serverConfig = {
  port: process.env.HTTP_SERVER_PORT
}
