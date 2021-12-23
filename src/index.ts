import { ApolloServer } from 'apollo-server-express'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import express from 'express'
import http from 'http'
import authRouter from '@src/auth'
import schema from '@src/services/graphql/schema'

require('dotenv').config()

async function listen() {
  const app = express()

  app.use(express.json())
  app.use('/auth', authRouter)

  const httpServer = http.createServer(app)

  const server = new ApolloServer({
    schema,
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
      `Server is ready at http://localhost:${process.env.HTTP_SERVER_PORT}\n`,
      'Authentication: /auth\n',
      'GraphQL: /graphql'
    )
  } catch (err) {
    console.error('Error starting the node server', err)
  }
}

void main()
