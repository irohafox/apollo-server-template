import jwt from 'jsonwebtoken'

const jwtConfig: {
  algorithm: jwt.Algorithm
  accessTokenExpiresIn: string
  refreshTokenExpiresIn: string
  secret: jwt.Secret
} = {
  algorithm: 'HS256',
  accessTokenExpiresIn: '30m',
  refreshTokenExpiresIn: '30d',
  secret: 'test_secret'
}

export default jwtConfig
