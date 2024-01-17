import gql from 'graphql-tag';

export const typeDefs = gql`
  type Query {
    example: String
    fruits: [Fruit!]
    users: [User!]
    albums: [Album!]
  }

  type Mutation {
    addFruit(name: String!): [Fruit]
  }

  type Fruit {
    id: ID!
    name: String!
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
