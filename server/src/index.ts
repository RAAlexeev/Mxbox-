import { ApolloServer} from 'apollo-server-express';
import { typeDefs, resolvers } from './schema';

 export const appolo = new ApolloServer({
    // These will be defined for both new or existing servers
    typeDefs,
    resolvers,
  });

