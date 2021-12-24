import { Request } from 'express'
import { verifyToken } from '@src/middleware/auth'

export function authContext(req: Request) {
  try {
    const authHeader = req.headers.authorization as string
    const accessToken = authHeader.replace('Bearer ', '')
    return verifyToken(accessToken) as {
      id: number
    }
  } catch (_) {
    return null
  }
}
