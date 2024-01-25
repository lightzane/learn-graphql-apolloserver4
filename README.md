# Integrate with Express

https://expressjs.com/

**About Express Middleware from Apollo Server**

https://www.apollographql.com/docs/apollo-server/api/express-middleware#example

## Prerequisite

- Knowledge about `Express`
- The **final** code of the **Standalone Apollo Server**

## Install Express

```bash
npm i express
```

**With Typescript**

```bash
npm i -D @types/express
```

## Express Template

```ts
import express from 'express';
import http from 'http';

const port = process.env.PORT || 3000;

// Required logic for integrating with Express
const app = express();

// Our httpServer handles incoming requests to our Express app.
// Below, we tell Apollo Server to "drain" this httpServer,
// enabling our servers to shut down gracefully.
const httpServer = http.createServer(app);

app.use(express.json()); // based on body-parser - to parse and read input data/body from the request

httpServer.listen({ port }, () => {
  console.log(`🚀 Express server running at port: ${port}`);
});

app.get('/', (req, res) => {
  res.json(req.body);
});
```

## Update Apollo Server

`./src/index.ts`

```diff
+import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

// Add "<BaseContext>" to resolve Typescript error when calling `expressMiddleware()`
+const server = new ApolloServer<BaseContext>({
   typeDefs,
   resolvers,
+  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
 });

+await server.start();
```

## Remove Standalone Server

```diff
-import { startStandaloneServer } from '@apollo/server/standalone';
-
-const { url } = await startStandaloneServer(server, {
-  context: async () => {
-    const { cache } = server;
-
-    return {
-      dataSources: {
-        userApi: new UserAPI({ cache }),
-        albumApi: new AlbumAPI({ cache }),
-      },
-    };
-  },
-});
```

## Replace with Express Middleware

```ts
import { expressMiddleware } from '@apollo/server/express4';

app.use(
  '/graphql',
  // expressMiddleware accepts the same arguments:
  // an Apollo Server instance and optional configuration options
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
```

## CORS

We can also add CORS for Express.

https://github.com/expressjs/cors#readme

```bash
npm i cors
```

`./src/index.ts`

```ts
app.use(cors());

// Or
app.use(
  cors({
    origin: 'https://...',
  }),
);
```

**This is also another approach:**

```diff
app.use(
  '/graphql',
+ cors(),
+ express.json({ limit: '50mb' }),
  // expressMiddleware accepts the same arguments:
  // an Apollo Server instance and optional configuration options
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
```
