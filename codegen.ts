import { CodegenConfig } from '@graphql-codegen/cli';

const codegen: CodegenConfig = {
  schema: './src/schema.graphql',
  generates: {
    './src/types.ts': {
      plugins: ['typescript', 'typescript-resolvers'],

      // config are passed to plugins
      // config: {
      //   // config from typescript-resolvers plugin
      //   contextType: './context#DataSourceContext', // path relative to types.ts
      //   mappers: {
      //     Album: './models#AlbumModel', // path relative to types.ts
      //   },
      // },
    },
  },
};

export default codegen;
