import mocks from './datasources/mocks';
import { EventModel } from './models';
import { dateTimeScalar } from './scalars/date-time.scalar';
import { Resolvers } from './types';

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
