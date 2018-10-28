import { observable, action } from 'mobx'
import gql from 'graphql-tag'
import { AppStore } from '../app.store'

const DevicesQuery = gql`
  query DevicesQuery {
    devices
    {
      _id,
      name,
      mb_addr,
      ip_addr
    }
  }
`
const DevicesMutation = gql`
mutation addDevice{
  addDevice(device:{name:"новый"}){
    _id
    name
  }
  mutation delDevice{
    delDevice(_id:ID!){
      status
    }
  }
}
`
const DevicesSubscription = gql`
subscription DeviceSubscription($name: String!){
  Post(filter: {
    mutation_in: [CREATED],
    node: {
      name: $name
    }
  }) {
    node {
      id,
      name,
      title,
      message
    }
  }
}
`

interface Device {
  _id: string
  name: string
  mb_addr?: string
  ip_addr?: string
}

interface DevicesQueryResult {
  devices?: Array<Device>
  device?:Device
}

export class DevicesStore {
  appStore: AppStore
 // deviceSubscription

  @observable devices: Array<Device> = []

  constructor() {
    let self = this
    this.appStore = AppStore.getInstance()
/*      this.deviceSubscription = this.appStore.apolloClient.subscribe({
      query: DevicesSubscription,
      // This way realtime updates will work only when both posting and reading users have the same name. Proof of concept.
      variables: { name: this.appStore.username }
    }).subscribe({
      next(data) {
        self.devices.unshift(data.Post.node)
      },
      error(err) { console.error('err', err) },
    }) */
  } 

  destructor() {
    //this.deviceSubscription.unsubscribe()
  }

  async initializeDevices() {
    const result = await this.appStore.apolloClient.query<DevicesQueryResult,{}>({
      query: DevicesQuery,
      
      fetchPolicy: 'network-only'
    })
   
    this.devices = result.data.devices
  }
  async addDevice() {
     const result = await this.appStore.apolloClient.mutate<DevicesQueryResult,{}>({
      mutation: DevicesMutation,
      fetchPolicy: 'no-cache'  
    })
    alert(result.data.toString())  
  
    this.devices.push(result.data.device)
  }
}
