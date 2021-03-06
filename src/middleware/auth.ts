import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { jwtConfig } from '@src/config'

export function createEncryptedPassword(
  plainPassword: string
): Promise<string> {
  const saltRounds = 10
  return bcrypt.hash(plainPassword, saltRounds)
}

export function comparePassword(
  plainPassword: string,
  encryptedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, encryptedPassword)
}

export function createToken(
  userId: number,
  reauthVersion: number
): {
  accessToken: string
  refreshToken: string
} {
  return {
    accessToken: jwt.sign({ id: userId }, jwtConfig.secret, {
      algorithm: jwtConfig.algorithm,
      expiresIn: jwtConfig.accessTokenExpiresIn
    }),
    refreshToken: jwt.sign({ id: userId, reauthVersion }, jwtConfig.secret, {
      algorithm: jwtConfig.algorithm,
      expiresIn: jwtConfig.refreshTokenExpiresIn
    })
  }
}

export function verifyToken(token: string) {
  return jwt.verify(token, jwtConfig.secret)
}
