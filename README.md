# 03 Create Apollo Server

## Update index.ts

```ts
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema';

async function startApolloServer() {
  const server = new ApolloServer({ typeDefs });

  const { url } = await startStandaloneServer(server);

  console.log(`🚀 Server running at ${url}`);
}

startApolloServer();
```

## Run

```bash
npm run dev
```

Output:

```bash
[nodemon] 3.0.3
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): src/**/*
[nodemon] watching extensions: ts,json
[nodemon] starting `ts-node ./src/index.ts`
🚀 Server running at http://localhost:4000/
```

Upon checking in browser, you should now be able to see the `schema` and `explorer` where we can perform our operations.
