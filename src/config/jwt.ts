import jwt from 'jsonwebtoken'

export const jwtConfig: {
  algorithm: jwt.Algorithm
  accessTokenExpiresIn: string
  refreshTokenExpiresIn: string
  secret: string
} = {
  algorithm: 'HS256',
  accessTokenExpiresIn: '30m',
  refreshTokenExpiresIn: '30d',
  secret: process.env.AUTH_SECRET as string
}
