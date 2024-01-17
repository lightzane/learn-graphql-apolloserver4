# 04 Resolvers

We will now write `resolver` functions to fetch data and return it

## Create resolvers.ts

`src/resolvers.ts`

```ts
import mocks from './datasources/mocks';

export const resolvers = {
  Query: {
    example: () => 'Hello World',
    users: () => mocks.users,
    albums: () => mocks.albums,
  },
};
```

## Register resolvers in Apollo Server

```diff
 import { ApolloServer } from '@apollo/server';
 import { startStandaloneServer } from '@apollo/server/standalone';
+import { resolvers } from './resolvers';
 import { typeDefs } from './schema';

 async function startApolloServer() {
   const server = new ApolloServer({
     typeDefs,
+    resolvers,
   });

   const { url } = await startStandaloneServer(server);

   console.log(`🚀 Server running at ${url}`);
 }

 startApolloServer();
```

## Run

```bash
npm run dev
```

## Test Query

```graphql
query ExampleQuery {
  example
  users {
    id
    name
  }
}
```

Output:

```json
{
  "data": {
    "example": "Hello World",
    "users": [
      {
        "id": 1,
        "name": "Leanne Graham"
      },
      {
        "id": 2,
        "name": "Ervin Howell"
      }
    ]
  }
}
```
