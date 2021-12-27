import { prisma } from '@src/middleware/db'

const userResolver = {
  queries: {
    user: (_: any, {}, context: any) => {
      return prisma.user.findUnique({
        where: {
          id: context.currentUser.id
        }
      })
    }
  }
}

export default userResolver
