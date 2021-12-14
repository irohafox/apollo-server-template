import userResolver from '@src/graphql/resolvers/user'

const resolvers = {
  Query: {
    ...userResolver.queries
  },
  Mutation: {
    ...userResolver.mutations
  }
}

export default resolvers
