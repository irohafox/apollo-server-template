import bcrypt from 'bcrypt'

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
