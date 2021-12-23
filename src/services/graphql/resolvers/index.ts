import userResolver from '@src/services/graphql/resolvers/user'

const resolvers = {
  Query: {
    ...userResolver.queries
  }
}

export default resolvers
