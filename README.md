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
