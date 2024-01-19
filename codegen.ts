import { CodegenConfig } from '@graphql-codegen/cli';

const codegen: CodegenConfig = {
  schema: './src/schema.graphql',
  generates: {
    './src/types.ts': {
      plugins: ['typescript', 'typescript-resolvers'],

      // config are passed to plugins
      config: {
        // config from typescript-resolvers plugin
        scalars: {
          // * Option 1
          // DateTime: 'string' // Typescript type
          // * Option 2
          DateTime: {
            input: 'number', // Typescript type (return type from Custom Scalar function)
            output: 'string',
          },
        },
        // contextType: './context#DataSourceContext', // path relative to types.ts
        mappers: {
          Event: './models#EventModel', // path relative to types.ts
        },
      },
    },
  },
};

export default codegen;
