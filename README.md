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
