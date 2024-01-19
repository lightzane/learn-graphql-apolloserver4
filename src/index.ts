import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { readFileSync } from 'fs';
import gql from 'graphql-tag';
import { resolvers } from './resolvers';

export const typeDefs = gql(
  readFileSync('./src/schema.graphql', { encoding: 'utf-8' })
);

async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server);

  console.log(`🚀 Server running at ${url}`);
}

startApolloServer();
