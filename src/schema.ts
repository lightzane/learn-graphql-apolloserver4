import gql from 'graphql-tag';

export const typeDefs = gql`
  type Query {
    example: String
    users: [User!]
    albums: [Album!]
  }

  type User {
    id: Int!
    name: String!
    username: String
    email: String
  }

  type Album {
    id: Int!
    title: String!
  }
`;
