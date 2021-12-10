import { join } from 'path'
import { readdirSync, readFileSync } from 'fs'
import { makeExecutableSchema } from '@graphql-tools/schema'

const gqlFiles = readdirSync(join(__dirname, './typedefs'))

const typeDefs = gqlFiles.map((file) => {
  return readFileSync(join(__dirname, './typedefs', file), {
    encoding: 'utf8'
  })
})

// TODO: resolversの分割
const resolvers = {
  Query: {
    me: () => ({ username: 'irohafox' })
  }
}

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

export default schema
