import { prisma } from '@src/middleware/db'

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
