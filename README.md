# Episodes

1. [Initiate Project](#01-initiate-project)
2. [Building our Schema](#02-build-schema)
3. [Create Apollo Server](#03-create-apollo-server)
4. [Resolvers](#04-resolvers)
5. [Mutations](#05-mutations)
6. [Context and Datasources](#06-context-and-datasources)
7. [Related Data and Resolver Chain](#07-related-data-and-resolver-chain)
8. [GraphQL Code Generator for Typescript](#08-codegen---graphql-code-generator)
9. [GraphQL Schema file](#09---graphql-schema-file)

# 01 Initiate Project

Learning GraphQL using Apollo Server 4 built from scratch or blank project.

> Note: This project was created using **node v18** with **npm v9**

## Content

1. [Initialize Node Project](#initialize-node-project)
2. [Create initial file](#create-initial-file)
3. [Install initial dev dependencies](#install-initial-dev-dependencies)
4. [Generate tsconfig.json](#generate-tsconfigjson)
5. [Update package.json](#update-packagejson)
6. [Test the project](#test-the-project)

## Initialize Node Project

```bash
npm init -y
```

## Create initial file

Create `src/index.ts`.

## Install initial dev dependencies

```bash
npm install -D typescript nodemon ts-node
```

|              |                                                                          |
| ------------ | ------------------------------------------------------------------------ |
| `typescript` | Javascript with syntax for types                                         |
| `nodemon`    | For development purpose to reload the server automatically every changes |
| `ts-node`    | Required by `nodemon` to run `typescript`                                |

## Generate tsconfig.json

```bash
npx tsc --init
```

## Update package.json

```diff
{
  "scripts": {
+   "dev": "nodemon ./src/index.ts --watch src",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

## Test the project

### Add temporary code to test

`src/index.ts`

```ts
console.log('Hello World');
```

### Run

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
Hello World
[nodemon] clean exit - waiting for changes before restart
```

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

# 05 Mutations

Let's create a new set of mock data.

`datasources/mocks.ts`

```ts
const fruits = [
  {
    id: '1',
    name: 'apple',
  },
];

export default { users, albums, fruits };
```

## Update schema

`src/schema.ts`

```diff
 type Query {
   example: String
+  fruits: [Fruit!]
   users: [User!]
   albums: [Album!]
 }

+ type Mutation {
+   addFruit(name: String!): [Fruit]
+ }

+type Fruit {
+  id: ID!
+  name: String!
+}
```

## Update Resolvers

`src/resolvers.ts`

**Heads up**: You may encounter typescript errors. Ignore it for now and close the file.

```diff
 export const resolvers = {
   Query: {
     example: () => 'Hello World',
+    fruits: () => mocks.fruits,
     users: () => mocks.users,
     albums: () => mocks.albums,
   },
+  Mutation: {
+    addFruit: (_, { name }) => {
+      mocks.fruits.push({
+        id: Date.now().toString(),
+        name,
+      });
+
+      return mocks.fruits;
+    },
+  },
 };
```

#### A `resolver` function have 4 arguments:

- `parent` an object that is the parent of a field in a resolver chain (_later on this_)

- `args` an object in which its keys are arguments passed in a `query` or `mutation`

- `context` an object shared across all resolvers that are executing for a particular operation. The resolver needs this argument to share state, like authentication information, a database connection (_later on this_)

- `info` contains information about the operation's execution state, including the field name, the path to the field from the root, and more. It's not used as frequently as the others, but it can be useful for more advanced actions like setting cache policies at the resolver level.

## Silencing the Typescript Error

The error we are encountering is one of the Typescript's feature of `noImplicitAny` which is `true` by default. (_We will fix the typings later by using `@graphql-codegen`_)

For now, let us have a quick solution by addding this in the `tsconfig.json`

```diff
{
  ...
+  "noImplicitAny": false,
}
```

```bash
npm run dev
```

## Test

```graphql
mutation AddingFruits($name: String!) {
  addFruit(name: $name) {
    id
    name
  }
}
```

**Variables**

```json
{
  "name": "Lemon"
}
```

OUTPUT

```json
{
  "data": {
    "fruits": [
      {
        "id": "1",
        "name": "apple"
      },
      {
        "id": "1705462823447",
        "name": "Lemon"
      }
    ]
  }
}
```

# 06 Context and Datasources

We can pass a `context` object in the options of `startStandaloneServer`.

The context has many usages such as getting **user tokens**, **dataSources**, **request headers**, etc.

## Add context in apollo server

`src/index.ts`

```diff
-const { url } = await startStandaloneServer(server)
+const { url } = await startStandaloneServer(server, {
   context: async () => {
     return {};
   },
 });
```

## Create Class as a basic dataSource

`datasources/user-api.ts`

```ts
import mocks from './mocks';

export class UserAPI {
  getUsers() {
    return mocks.users;
  }
}
```

## Pass the datasource in context

`src/index.ts`

```diff
+import { UserAPI } from './datasources/user-api';

 const { url } = await startStandaloneServer(server, {
   context: async () => {
     return {
+       dataSources: {
+         userApi: new UserAPI(),
+       },
     };
   },
 });
```

## Use context in Resolvers

As a review, the `resolver` function have 4 arguments: `parent`, `args`, `context`, `info`. We can access the `dataSources` in the context argument.

`src/resolvers.ts`

```diff
export const resolvers = {
  Query: {
    ...
-   users: () => mocks.users,
+   users: (_, __, { dataSources }) => {
+     return dataSources.userApi.getUsers()
+   }
    ...
  },
};
```

## Try it

```graphql
query GetUsers {
  users {
    name
    username
  }
}
```

# RESTDataSource

We can also retrieve data from different datasources such as database or another `REST API` using `@apollo/datasource-rest`. Other packages will be used when retrieving directly from databases.

```bash
npm install @apollo/datasource-rest
```

Update `datasources/user-api.ts`

```ts
import { RESTDataSource } from '@apollo/datasource-rest';

export class UserAPI extends RESTDataSource {
  baseURL = 'https://jsonplaceholder.typicode.com';

  getUsers() {
    return this.get('users');
  }
}
```

The advantage of using `RESTDataSource` is that it has caching mechanism.

`src/index.ts`

```diff
const { url } = await startStandaloneServer(server, {
  context: async () => {
+   const { cache } = server;

    return {
      dataSources: {
+       userApi: new UserAPI({ cache }),
      },
    };
  },
});
```

## Try it

You would now be getting more user data coming from this REST API

```graphql
query GetUsers {
  users {
    name
    username
  }
}
```

## Apply REST for the Album

`datasources/album-api.ts`

```ts
import { RESTDataSource } from '@apollo/datasource-rest';

export class AlbumAPI extends RESTDataSource {
  baseURL = 'https://jsonplaceholder.typicode.com';

  getAlbums() {
    return this.get('albums');
  }
}
```

`src/index.ts`

```diff
const { url } = await startStandaloneServer(server, {
  context: async () => {
    const { cache } = server;

    return {
      dataSources: {
        userApi: new UserAPI({ cache }),
+       albumApi: new AlbumAPI({ cache }),
      },
    };
  },
});
```

`src/resolvers.ts`

```diff
export const resolvers = {
  Query: {
    ...
+   albums: (_, __, { dataSources }) => {
+     return dataSources.albumApi.getAlbums();
+   },
  },
};
```

# 07 Related Data and Resolver Chain

We will now connect `Album` and `Author`.

## Update Album Schema

Let us update our `src/schema.ts`

```diff
type Album {
  id: Int!
  title: String!
+ user: User
}
```

## Actual Album data

Notice that the structure that we have in our data (Source: https://jsonplaceholder.typicode.com/albums)

```json
{
  "userId": 1,
  "id": 1,
  "title": "quidem molestiae enim"
}
```

We do not want users to query the `userId` but instead we want it to be `User`.

Behind the scenes, we will use `userId` to get the `User` that the client will never see it under the hood.

Update `datasources/user-api.ts`

```diff
import { RESTDataSource } from '@apollo/datasource-rest';

export class UserAPI extends RESTDataSource {
  baseURL = 'https://jsonplaceholder.typicode.com';

  getUsers() {
    return this.get('users');
  }

+ getUser(id: number) {
+   return this.get(`users/${id}`);
+ }
}
```

## Resolve Chain

Since the query will be `Albums.user`, you can observe that the `parent` is `Album` of the `user` field.

Remember the structure of the `parent` (which is Album):

```json
{
  "userId": 1,
  "id": 1,
  "title": "quidem molestiae enim"
}
```

We need to create a resolver for `Albums.user`

`src/resolvers.ts`

```diff
export const resolvers = {
  Query: {...},
  Mutation: {...},
+ Album: {
+   user: async (parent, _, { dataSources }) => {
+     return dataSources.userApi.getUser(parent.userId);
+   },
+ },
};
```

## Try It!

```graphql
query AlbumsAndUser {
  albums {
    id
    title
    user {
      name
    }
  }
}
```

OUTPUT

```json
{
  "data": {
    "albums": [
      {
        "id": 1,
        "title": "quidem molestiae enim",
        "user": {
          "name": "Leanne Graham"
        }
      }
    ]
  }
}
```

# 08 Codegen - GraphQL Code Generator

If you remember the typescript error we encountered, we will now do something about it.

Since we are using `Typescript`, you noticed that everything in the resolvers has a type of `any`.

We can make use of a GraphQL Code Generator.

```bash
npm install -D @graphql-codegen/cli

# Install the following plugins as well!
npm install -D @graphql-codegen/typescript @graphql-codegen/typescript-resolvers
```

See [references](#graphql-codegen-references) below for these packages.

So, what are these plugins responsible for in the code generation process?

Well, `@graphql-codegen/typescript` is the base plugin needed to generate TypeScript types from our schema.

And `@graphql-codegen/typescript-resolvers` does something similar - it will review our schema, consider the types and fields we've defined, and output the types we need to accurately describe what data our resolver functions use and return.

With that, we're ready to generate some types!

## Update package.json

```diff
{
  "scripts": {
    ...
+   "generate": "graphql-codegen"
  }
}
```

## Create Codegen Configuration

Create `./codegen.ts` in the root directory.

```ts
// Initial setup
import { CodegenConfig } from '@graphql-codegen/cli';

const codegen: CodegenConfig = {
  schema: './src/schema.ts',
  generates: {
    './src/types.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
    },
  },
};

export default codegen;
```

```bash
npm run generate
```

```bash
✔ Parse Configuration
✔ Generate outputs
```

This should now generate `./src/types.ts`

At the bottom of the file, we'll find the type `Resolvers`. This is the type that we'll use to more accurately describe the data our resolver functions are capable of returning, based on the schema fields they map to.

```ts
export type Resolvers<ContextType = any> = {
  Album?: AlbumResolvers<ContextType>;
  Fruit?: FruitResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};
```

### Update `resolvers.ts`

```ts
import { Resolvers } from './types';

export const resolvers: Resolvers = {
  ...
}
```

We're now able to make the benefits in the typescript as we could already see some errors. Let us take care of the `dataSources` issue first since they are still returning `any` type.

### Create `src/context.ts`

```ts
import { AlbumAPI } from './datasources/album-api';
import { UserAPI } from './datasources/user-api';

export type DataSourceContext = {
  dataSources: {
    userApi: UserAPI;
    albumApi: AlbumAPI;
  };
};
```

### Update `codegen.ts`

```diff
const codegen: CodegenConfig = {
  schema: './src/schema.ts',
  generates: {
    './src/types.ts': {
      plugins: ['typescript', 'typescript-resolvers'],

      // config are passed to plugins
+     config: {
+       // config from typescript-resolvers plugin
+       contextType: './context#DataSourceContext', // path relative to types.ts
+     },
    },
  },
};
```

```bash
npm run generate
```

Notice the updated `./src/types.ts`

```diff
+export type Resolvers<ContextType = DataSourceContext> = {
   Album?: AlbumResolvers<ContextType>;
   Fruit?: FruitResolvers<ContextType>;
   Mutation?: MutationResolvers<ContextType>;
   Query?: QueryResolvers<ContextType>;
   User?: UserResolvers<ContextType>;
 };
```

But there is still an error! Find the red squiggly appear under `userId` in our `Album.user`

Since we defined `user` field in our `Album` type schema, then it does not expect to have a `userId` field. But in our case, it is actually expected.

We can specify a model for the `Album`.

### Specify model Album

Create `src/models.ts`

```ts
export type AlbumModel = {
  userId: number;
  id: number;
  title: string;
};
```

`codegen.ts`

```diff
const codegen: CodegenConfig = {
  schema: './src/schema.ts',
  generates: {
    './src/types.ts': {
      plugins: ['typescript', 'typescript-resolvers'],

      // config are passed to plugins
      config: {
        // config from typescript-resolvers plugin
        contextType: './context#DataSourceContext', // path relative to types.ts
+       mappers: {
+         Album: './models#AlbumModel', // path relative to types.ts
+       },
      },
    },
  },
};
```

```bash
npm run generate
```

**Minimum typings are now fixed!** It's up to you to continue adding a specific model on the `User` as well.

## GraphQL Codegen References

#### @graphql-codegen/cli

- https://the-guild.dev/graphql/codegen/docs/config-reference/config-field#root-level

#### @graphql-codegen/typescript

- https://the-guild.dev/graphql/codegen/plugins/typescript/typescript

#### @graphql-codegen/typescript-resolvers

- `contextType` https://the-guild.dev/graphql/codegen/plugins/typescript/typescript-resolvers#contexttype
- `mappers` https://the-guild.dev/graphql/codegen/plugins/typescript/typescript-resolvers#mappers

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
