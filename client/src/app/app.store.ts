import { observable, action } from 'mobx'
import ApolloClient from "apollo-boost";
import { SubscriptionClient  } from 'subscriptions-transport-ws'



const wsClient = new SubscriptionClient(`ws://192.168.0.97/graphql/subscriptions`, {
  reconnect: true,
  connectionParams: {
    // Pass any arguments you want for initialization
  } 
})




export class AppStore {
  static instance: AppStore
  @observable username = 'Mr. User'
  apolloClient = new ApolloClient({
    uri: `http://192.168.0.97:3001/graphql`
  })

  static getInstance() {
    return AppStore.instance || (AppStore.instance = new AppStore())
  }

  @action onUsernameChange = (val) => {
    this.username = val
  }

}
