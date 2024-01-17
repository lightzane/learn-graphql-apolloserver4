# 02 Build Schema

## Install dependencies

To get started with our schema, we'll need a couple packages first: `@apollo/server`, `graphql` and `graphql-tag`.

- The `@apollo/server` package provides a full-fledged, spec-compliant GraphQL server.

- The `graphql` package provides the core logic for parsing and validating GraphQL queries.

- The `graphql-tag` package provides the `gql` template literal that we'll use in a moment.

```bash
npm install @apollo/server graphql graphql-tag
```

## Create schema file

`src/schema.ts`

```ts
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
```

## Create mock data

`src/datasources/mocks.ts`

```ts
const users = [
  {
    id: 1,
    name: 'Leanne Graham',
    username: 'Bret',
    email: 'Sincere@april.biz',
  },
  {
    id: 2,
    name: 'Ervin Howell',
    username: 'Antonette',
    email: 'Shanna@melissa.tv',
  },
];

const albums = [
  {
    userId: 1,
    id: 1,
    title: 'quidem molestiae enim',
  },
  {
    userId: 1,
    id: 2,
    title: 'sunt qui excepturi placeat culpa',
  },
];

export default { users, albums };
```
