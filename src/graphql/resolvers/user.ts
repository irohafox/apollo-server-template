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
  },
  mutations: {
    createUser: async (_: any, { input }: any) => {
      const user = await prisma.user.create({
        data: input
      })
      return user
    }
  }
}

export default userResolver
