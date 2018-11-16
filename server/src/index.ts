import { ApolloServer} from 'apollo-server-express';
import { typeDefs, resolvers } from './schema';

 export const appolo = new ApolloServer({
    // These will be defined for both new or existing servers
    typeDefs,
    resolvers,
    subscriptions: {
      path:':3001' ,
      onConnect: (connectionParams, webSocket) => {
      
        //if (connectionParams.authToken) {
          return true//validateToken(connectionParams.authToken)
          //  .then(findUser(connectionParams.authToken))
         //   .then(user => {
          //    return {
          //      currentUser: user,
          //    };
         //   });
       // }
  
        //throw new Error('Missing auth token!');
      },
    },
  });

 