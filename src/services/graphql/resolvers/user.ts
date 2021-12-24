import { prisma } from '@src/middleware/db'

const userResolver = {
  queries: {
    user: (_: any, { id }: { id: number }, context: any) => {
      console.log(context.currentUser)
      return prisma.user.findUnique({
        where: {
          id: id
        }
      })
    },
    users: (_: any, {}, context: any) => {
      console.log(context.currentUser)
      return prisma.user.findMany()
    }
  }
}

export default userResolver
