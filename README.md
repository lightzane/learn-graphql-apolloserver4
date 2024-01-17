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
