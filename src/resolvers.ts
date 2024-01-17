import mocks from './datasources/mocks';

export const resolvers = {
  Query: {
    example: () => 'Hello World',
    fruits: () => mocks.fruits,
    users: (_, __, { dataSources }) => {
      return dataSources.userApi.getUsers();
    },
    albums: (_, __, { dataSources }) => {
      return dataSources.albumApi.getAlbums();
    },
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
