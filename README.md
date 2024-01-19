# Learn Custom Scalars

1. [Demo](#demo)
2. [Getting Started](#getting-started)

# Demo

## Single Data

```ts
{
  events: [
    {
      id: '1',
      name: "(아이유) IU's birthday",
      date: '737481600000',
    },
  ];
}
```

## Schema

```graphql
"Resolver for this scalar is found in ./src/scalars/date-time.scalar.ts"
scalar DateTime

type Query {
  "Returns data while applying custom scalars"
  events: [Event!]
  "Returns raw data"
  raw: [RawEvent!]
}

type Event {
  ...
  date: DateTime
}

type RawEvent {
  ...
  date: String!
}
```

## Query Operation

```graphql
query ExampleQuery {
  events {
    name
    date
  }
  raw {
    name
    date
  }
}
```

**OUTPUT**

```json
{
  "data": {
    "events": [
      {
        "name": "(아이유) IU's birthday",
        "date": "5/16/1993, 12:00:00 AM"
      }
    ],
    "raw": [
      {
        "name": "(아이유) IU's birthday",
        "date": "737481600000"
      }
    ]
  }
}
```

# Getting Started

1. [Create custom scalar resolver function](#create-custom-scalar-resolver-function)
2. [Define custom scalar in schema](#define-custom-scalar-in-schema)
3. [Register custome scalar in resolvers](#register-custom-scalar-in-resolvers)

## Create Custom Scalar Resolver Function

`src/scalars/date-time.scalar.ts`

```ts
import { GraphQLError, GraphQLScalarType, Kind } from 'graphql';

export const dateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',
  description:
    'Store as number in database. Return DateTime value as human-friendly to read',

  // Sending value to Client
  serialize: (value) => {
    // TODO: Research solution for Typescript error when there are no "as string" provided after value
    return new Date(parseInt(value as string)).toLocaleString('en-US');
  },

  // Custom scalar parsing from "Input Variables"
  parseValue: (value) => {
    const date = new Date(value as string | number);

    if (isNaN(date.getTime())) {
      throw new GraphQLError('Custom error: Invalid date input');
    }

    return new Date(value as string | number).getTime();
  },

  // Parsing literal values directly specified from the query document
  parseLiteral: (ast) => {
    // ! Return type of this function will be equivalent to the "input" in codegen.ts

    // User input is string
    if (ast.kind === Kind.STRING) {
      const date = new Date(ast.value);

      if (isNaN(date.getTime())) {
        throw new GraphQLError('Custom error: Invalid date input');
      }

      return date.getTime();
    }

    // User input is number
    else if (ast.kind === Kind.INT) {
      return ast.value;
    }

    return null;
  },
});
```

## Define Custom Scalar in Schema

`src/schema.graphql`

```graphql
scalar DateTime

type Event {
  id: ID!
  name: String!
  date: DateTime
}
```

### Full Content

```graphql
"Resolver for this scalar is found in ./src/scalars/date-time.scalar.ts"
scalar DateTime

type Query {
  "Returns data while applying custom scalars"
  events: [Event!]
  "Returns raw data"
  raw: [RawEvent!]
}

type Mutation {
  addEvent(name: String!, date: DateTime!): AddEventResponse!
}

type Event {
  id: ID!
  name: String!
  date: DateTime
}

type RawEvent {
  id: ID!
  name: String!
  date: String!
}

type AddEventResponse {
  event: Event
  raw: RawEvent
}
```

## Register Custom Scalar in Resolvers

`src/resolvers.ts`

```ts
import { dateTimeScalar } from './scalars/date-time.scalar';

export const resolvers: Resolvers = {
  DateTime: dateTimeScalar
  ...
}
```

### Full content

```ts
export const resolvers: Resolvers = {
  DateTime: dateTimeScalar,
  Query: {
    events: () => mocks.events,
    raw: () => mocks.events,
  },
  Mutation: {
    /**
     * ! Since args.date is a "DateTime" or custom scalar
     * ! Then, "parseValue()" or "parseLiteral()" function inside "dateTimeScalar"
     * ! class will be executed first before addEvent() resolver
     *
     * * The return value from "parseValue()" or "parseLiteral()" will be passed to the args.date
     */
    addEvent: (_, args) => {
      const newEvent: EventModel = {
        id: Date.now().toString(),
        name: args.name,
        date: args.date.toString(),
      };

      mocks.events.push(newEvent);

      return {
        event: newEvent,
        raw: newEvent,
      };
    },
  },
};
```

## For Typescript Types

`codegen.ts`

```ts
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
        mappers: {
          Event: './models#EventModel', // path relative to types.ts
        },
      },
    },
  },
};

export default codegen;
```

**Also add a `BaseContext` in Apollo Server**

`src/index.ts`

```ts
// ! <BaseContext> is required since it's implicitly giving <GraphQLResolveInfo>
// ! when we have custom scalar in our Resolvers
const server = new ApolloServer<BaseContext>({
  typeDefs,
  resolvers,
});
```

If `BaseContext` is not present, we may encounter typescript error or red squiggly under `server`

```ts
const { url } = await startStandaloneServer(server);
```

# Review

```ts
import { GraphQLError, GraphQLScalarType, Kind } from 'graphql';

export const dateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',
  description: '...',

  // Sending value to Client
  serialize: (value) => {
    ...
  },

  // Custom scalar parsing from "Input Variables"
  parseValue: (value) => {
    ...
  },

  // Parsing literal values directly specified from the query document
  parseLiteral: (ast) => {
    ...
  },
});

```

## serialize()

This will be executed when the value is being send to the client.

## parseValue()

This will be executed when using this query syntax using **Input variables**:

```graphql
mutation AddEvent($name: String!, $date: DateTime!) {
  addEvent(name: $name, date: $date) {
    event {
      date
    }
    raw {
      date
    }
  }
}
```

## parseLiteral()

This will be executed when using this query syntax using **literal values** in the query document:

```graphql
mutation AddEvent($name: String!) {
  addEvent(name: $name, date: "1/19/2024") {
    event {
      date
    }
    raw {
      date
    }
  }
}
```

- The `parseValue()` and `parseLiteral()` will be executed before the field resolvers.

- The return value from these 2 functions will be passed to the `args` in field resolvers
