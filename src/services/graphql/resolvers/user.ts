import { prisma } from '@src/lib/db'
import bcrypt from 'bcrypt'

const generateEncryptedPassword = async (plainPassword: string) => {
  const saltRounds = 10
  return await bcrypt.hash(plainPassword, saltRounds)
}

const userResolver = {
  queries: {
    user: (_: any, { id }: { id: number }) => {
      return prisma.user.findUnique({
        where: {
          id: id
        }
      })
    },
    users: () => {
      return prisma.user.findMany()
    }
  }
}

export default userResolver
