import { gql } from 'apollo-server'

export const typeDefs = gql`
  type Query {
    getUsers(id: ID): [User]
  }

  type User {
    id: ID!
    name: String
  }
`
