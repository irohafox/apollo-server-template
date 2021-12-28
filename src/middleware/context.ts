import { Request } from 'express'
import { verifyToken } from '@src/middleware/auth'
import { PrismaClient } from '@prisma/client'

export type Context = {
  prisma: PrismaClient
  currentUser: VerifiedUser | null
}

type VerifiedUser = {
  id: number
}

type ContextRequest = {
  req: Request
}

const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query'
    }
  ]
})

if (prisma instanceof PrismaClient) {
  prisma.$on('query', (e: any) => {
    console.log('Query: ' + e.query)
    console.log('Duration: ' + e.duration + 'ms')
  })
}

const verifyUser: (req: Request) => VerifiedUser | null = (req: Request) => {
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

export const createContext: ({ req }: ContextRequest) => Context = ({
  req
}: ContextRequest) => {
  return { prisma, currentUser: verifyUser(req) }
}
