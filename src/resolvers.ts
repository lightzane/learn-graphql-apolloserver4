import mocks from './datasources/mocks';

export const resolvers = {
  Query: {
    example: () => 'Hello World',
    users: () => mocks.users,
    albums: () => mocks.albums,
  },
};
