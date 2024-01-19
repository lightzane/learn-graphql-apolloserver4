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
