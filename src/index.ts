import { ApolloServer, BaseContext } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { readFileSync } from 'fs';
import gql from 'graphql-tag';
import { resolvers } from './resolvers';

export const typeDefs = gql(
  readFileSync('./src/schema.graphql', { encoding: 'utf-8' }),
);

async function startApolloServer() {
  // ! <BaseContext> is required since it's implicitly giving <GraphQLResolveInfo>
  // ! when we have custom scalar in our Resolvers
  const server = new ApolloServer<BaseContext>({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server);

  console.log(`🚀 Server running at ${url}`);
}

startApolloServer();
