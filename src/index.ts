import { ApolloServer, BaseContext } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { readFileSync } from 'fs';
import gql from 'graphql-tag';
import { resolvers } from './resolvers';
import express from 'express';
import http from 'http';
import cors from 'cors';

export const typeDefs = gql(
  readFileSync('./src/schema.graphql', { encoding: 'utf-8' }),
);

async function startServer() {
  const port = process.env.PORT || 3000;

  const app = express();

  const httpServer = http.createServer(app);

  const server = new ApolloServer<BaseContext>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  httpServer.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });

  app.use('/', cors(), express.json(), expressMiddleware(server));

  // app.use('/', cors(), express.json(), expressMiddleware(server, {
  //   context: async ({ req }) => {
  //     return {
  //       dataSources: {}
  //     }
  //   }
  // }));
}

startServer();
