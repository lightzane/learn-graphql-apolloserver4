# 09 - GraphQL Schema file

Remember we wrote our type definitions or `schema` in the `src/schema.ts`.

We can also write down everything in its own separate `.graphql` file!

## Create the GraphQL schema file

`src/schema.graphql`

```graphql
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
  user: User
}
```

We can then use the `fs` (file system) package of `node` to read the `schema.graphql` file.

`src/schema.ts`

```ts
import { readFileSync } from 'fs';
import gql from 'graphql-tag';

export const typeDefs = gql(
  readFileSync('./src/schema.graphql', { encoding: 'utf-8' })
);
```

Update `package.json` as well for `nodemon` to detect changes in your `.graphql` file

```json
{
  "scripts": {
    "dev": "nodemon ./src/index.ts --watch src --ext ts,graphql"
  }
}
```

Also, don't forget to update the schema path in your `codegen.ts`!
