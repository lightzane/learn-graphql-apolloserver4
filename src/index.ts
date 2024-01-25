import { ApolloServer, BaseContext } from '@apollo/server';
import { AlbumAPI } from './datasources/album-api';
import { UserAPI } from './datasources/user-api';
import { resolvers } from './resolvers';
import { typeDefs } from './schema';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

async function startServer() {
  const port = process.env.PORT || 3000;

  // Required logic for integrating with Express
  const app = express();

  // Our httpServer handles incoming requests to our Express app.
  // Below, we tell Apollo Server to "drain" this httpServer,
  // enabling our servers to shut down gracefully.
  const httpServer = http.createServer(app);

  const server = new ApolloServer<BaseContext>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(cors());
  app.use(express.json()); // based on body-parser - to parse and read input data/body from the request

  httpServer.listen({ port }, () => {
    console.log(`🚀 Express server running at port: ${port}`);
  });

  app.get('/', (req, res) => {
    res.json(req.body);
  });

  app.use(
    '/graphql',
    // cors(),
    // express.json({ limit: '50mb' }),
    // * expressMiddleware accepts the same arguments:
    // * an Apollo Server instance and optional configuration options
    expressMiddleware(server, {
      context: async () => {
        const { cache } = server;

        return {
          dataSources: {
            userApi: new UserAPI({ cache }),
            albumApi: new AlbumAPI({ cache }),
          },
        };
      },
    }),
  );
}

startServer();
