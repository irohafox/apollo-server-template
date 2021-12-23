import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export function generateEncryptedPassword(
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

// TODO: jwt congfig
export function createToken(
  userId: number,
  reauthVersion: number
): {
  accessToken: string
  refreshToken: string
} {
  return {
    accessToken: jwt.sign({ id: userId }, 'test_secret', {
      algorithm: 'HS256',
      expiresIn: '30m'
    }),
    refreshToken: jwt.sign({ id: userId, reauthVersion }, 'test_secret', {
      algorithm: 'HS256',
      expiresIn: '30d'
    })
  }
}
