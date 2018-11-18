import * as express  from 'express';
const app = express();
import {appolo} from './index'
import { run as modbusTestRun } from './tests.devices/modbus.test';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
import { schema } from './schema';



appolo.applyMiddleware({app});
app.use('/', express.static('/home/Raa/workspace/Mxbox/client/dist'));
app.get('/*', function(req, res){
    res.sendFile('/home/Raa/workspace/Mxbox/client/dist/upload');
});

/* var   fs = require("fs"),
      http = require("https")

 const options = {
  key: fs.readFileSync("sslcert/server.key"),
  cert: fs.readFileSync("sslcert/server.crt")
};  */
  var server = /*http.createServer(options,*/ app/*)*/.listen(process.env.PORT || 3001,   ()=>{
  const host = server.address().address;
  const port = server.address().port;
  console.log('App listening at http://%s:%s$', host, port);
  return new SubscriptionServer({
    execute,
    subscribe,
    schema: schema,
  }, {

    server: server,
    path: '',
  })
  
})  
modbusTestRun()
export {server};