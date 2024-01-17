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
