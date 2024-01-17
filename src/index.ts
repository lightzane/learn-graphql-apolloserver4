import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { AlbumAPI } from './datasources/album-api';
import { UserAPI } from './datasources/user-api';
import { resolvers } from './resolvers';
import { typeDefs } from './schema';

async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    context: async () => {
      const { cache } = server;

      return {
        dataSources: {
          userApi: new UserAPI({ cache }),
          albumApi: new AlbumAPI({ cache }),
        },
      };
    },
  });

  console.log(`🚀 Server running at ${url}`);
}

startApolloServer();
