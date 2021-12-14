import { join } from 'path'
import { readdirSync, readFileSync } from 'fs'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const gqlFiles = readdirSync(join(__dirname, './typedefs'))

const typeDefs = gqlFiles.map((file) => {
  return readFileSync(join(__dirname, './typedefs', file), {
    encoding: 'utf8'
  })
})

// TODO: resolversの分割
const resolvers = {
  Query: {
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

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

export default schema
