import mocks from './datasources/mocks';

export const resolvers = {
  Query: {
    example: () => 'Hello World',
    fruits: () => mocks.fruits,
    users: () => mocks.users,
    albums: () => mocks.albums,
  },
  Mutation: {
    addFruit: (_, { name }) => {
      mocks.fruits.push({
        id: Date.now().toString(),
        name,
      });

      return mocks.fruits;
    },
  },
};
