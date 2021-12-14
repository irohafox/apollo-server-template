import { join } from 'path'
import { readdirSync, readFileSync } from 'fs'
import { makeExecutableSchema } from '@graphql-tools/schema'
import resolvers from '@src/graphql/resolvers'

const gqlFiles = readdirSync(join(__dirname, './typedefs'))

const typeDefs = gqlFiles.map((file) => {
  return readFileSync(join(__dirname, './typedefs', file), {
    encoding: 'utf8'
  })
})

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

export default schema
