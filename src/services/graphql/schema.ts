import { join } from 'path'
import { readdirSync, readFileSync } from 'fs'
import { makeExecutableSchema } from '@graphql-tools/schema'
import resolvers from '@src/services/graphql/resolvers'
import authDirectiveTransformer from '@src/services/graphql/transformers/authDirectiveTransformer'

const gqlFiles = readdirSync(join(__dirname, './typedefs'))

const typeDefs = gqlFiles.map((file) => {
  return readFileSync(join(__dirname, './typedefs', file), {
    encoding: 'utf8'
  })
})

let schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

schema = authDirectiveTransformer(schema)

export default schema
