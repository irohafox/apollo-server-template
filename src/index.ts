import { ApolloServer } from 'apollo-server-express'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import express from 'express'
import http from 'http'
import schema from '@src/graphql/schema'

require('dotenv').config()

async function listen() {
  const app = express()

  // NOTE: graphqlとは切り離して各サービスのエンドポイントを定義する(auth/callなど)
  // app.get('/auth', (_, res) => {
  //   res.send('auth')
  // })

  // app.get('/call', (_, res) => {
  //   res.send('call')
  // })

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
      `Server is ready at http://localhost:${process.env.HTTP_SERVER_PORT}/\n`,
      'GraphQL: /graphql'
    )
  } catch (err) {
    console.error('Error starting the node server', err)
  }
}

void main()
