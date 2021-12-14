import { prisma } from '@src/lib/db'

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
