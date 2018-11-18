import { ApolloServer } from 'apollo-server-express';
import { schema } from './schema';

 export const apollo = new ApolloServer({
    // These will be defined for both new or existing servers
    schema:schema,
    subscriptions: {
      
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

 