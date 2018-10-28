import { observable, action } from 'mobx'
import ApolloClient from "apollo-boost";
import { SubscriptionClient  } from 'subscriptions-transport-ws'

/* const PROJECT_ID = 'cj3bf7docbo5w0147sj4e66ik'

const wsClient = new SubscriptionClient(`wss://192.168.1.47/graphl`, {
  reconnect: true,
  connectionParams: {
    // Pass any arguments you want for initialization
  } 
})

*/


export class AppStore {
  static instance: AppStore
  @observable username = 'Mr. User'
  apolloClient = new ApolloClient({
    uri: `http://192.168.1.47:3001/graphql`
  })

  static getInstance() {
    return AppStore.instance || (AppStore.instance = new AppStore())
  }

  @action onUsernameChange = (val) => {
    this.username = val
  }

}
