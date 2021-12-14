import userResolver from '@src/graphql/resolvers/user'

const resolvers = {
  Query: {
    ...userResolver.queries
  }
}

export default resolvers
