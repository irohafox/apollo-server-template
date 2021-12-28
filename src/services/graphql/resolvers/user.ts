import { Context } from '@src/middleware/context'

const userResolver = {
  queries: {
    user: (_: any, {}, context: Context) => {
      return context.prisma.user.findUnique({
        where: {
          id: context.currentUser?.id
        }
      })
    }
  }
}

export default userResolver
