import { ApolloServer, gql } from 'apollo-server-express'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import express from 'express'
import http from 'http'

require('dotenv').config()

const typeDefs = gql`
  type Query {
    me: User
  }

  type User {
    username: String!
  }
`

const resolvers = {
  Query: {
    me: () => ({ username: 'irohafox' })
  }
}

async function listen() {
  const app = express()
  const httpServer = http.createServer(app)

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
  })

  await server.start()
  server.applyMiddleware({ app })

  return new Promise((resolve, reject) => {
    httpServer
      .listen(process.env.HTTP_SERVER_PORT)
      .once('listening', resolve)
      .once('error', reject)
  })
}

async function main() {
  try {
    await listen()
    console.log(
      `Server is ready at http://localhost:${process.env.HTTP_SERVER_PORT}/graphql`
    )
  } catch (err) {
    console.error('Error starting the node server', err)
  }
}

void main()
