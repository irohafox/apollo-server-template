import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

export const prisma: PrismaClient =
  global.prisma ||
  new PrismaClient({
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
