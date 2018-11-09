import { observable, action } from 'mobx'
import gql from 'graphql-tag'
import { AppStore } from '../app.store'
import { arrayRemove } from '../utils';
import {Device} from '../devices/devices.store';
import { Devices } from '../devices/devices.component';

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
const addDevice = gql`
mutation addDevice{
  addDevice(device:{name:"новый"}){
    _id,
    name
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

interface Sms{
  number:string[]
  text:string
}
interface Email{
  addr:string
  subj:string
  body?:string
}
interface Trig{
  type:number
  condition?:string
  sms?:Sms
  email?:Email
  cron?:string
}
export interface Rule {
  trigs?:Trig[]
  smss?: Sms[]
  email?: Email[]
}

interface RulesQueryResult {
  rules?: Array<Rule>
  rule?:Rule
}

export class RulesStore {
  appStore: AppStore
 // deviceSubscription

  @observable rules: Array<Rule> = []

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

  async initializeRules(device:Device) {
     const result = await this.appStore.apolloClient.query<RulesQueryResult,{}>({
      query: gql`query rules($device:ID!){rules(device:$device){trigs{type}}}`,
      variables:{device:device._id},
      fetchPolicy: 'network-only'
    }) 
    //console.log(result.data.rules)
    this.rules = result.data.rules
  }
  @action async addRule(device:Device) {
      const result = await this.appStore.apolloClient.mutate<RulesQueryResult,{}>({
      mutation: gql`mutation addRule($device:ID!){addRule(device:$device){status}}`,
      variables:{device:device._id},
      fetchPolicy: 'no-cache'  
    }) 
     
  
    this.rules.push({trigs:[]})
  }
  async delRule(rule) {
    const result = await this.appStore.apolloClient.mutate<RulesQueryResult,{}>({
      mutation: gql`mutation delDevice($_id:ID) { delDevice(_id:$){status}}`,
      variables:{ _id:rule._id },
      fetchPolicy: 'no-cache'  
    })
    
    arrayRemove.call(this.rules, this.rules.indexOf(rule))
  }

  async updDevice(value) {
    const result = await this.appStore.apolloClient.mutate<RulesQueryResult,{}>({
      mutation: gql`mutation updDevice($deviceInput:DeviceInput!) { updDevice(deviceInput:$deviceInput){status}}`,
      
      variables:{ deviceInput:value },
      fetchPolicy: 'no-cache'  
    })
    
  }



}
