import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

export const prisma: PrismaClient =
  global.prisma ||
  new PrismaClient({
    log: ['query']
  })
