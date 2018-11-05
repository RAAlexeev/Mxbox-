import { observable, action } from 'mobx'
import gql from 'graphql-tag'
import { AppStore } from '../app.store'
import { arrayRemove } from '../utils';


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
interface Rule {
  _id: string
  name?: string
  conditon?:string
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

  async initializeRules(device) {
/*     const result = await this.appStore.apolloClient.query<RulesQueryResult,{}>({
      query: gql`query qRules{rules($device:ID"){enabled}}`,
      variables:{},
      fetchPolicy: 'network-only'
    }) */
    this.rules = []
    //result.data.rules
  }
  async addRule() {
/*      const result = await this.appStore.apolloClient.mutate<RulesQueryResult,{}>({
      mutation: gql`mutation addRule`,
      fetchPolicy: 'no-cache'  
    }) */
     
  
    this.rules.push({_id:'1', name:"новое"})//result.data.addRule)
  }
  async delRule(rule) {
    const result = await this.appStore.apolloClient.mutate<RulesQueryResult,{}>({
      mutation: gql`mutation delDevice($_id:ID) { delDevice(_id:$_id){status}}`,
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
  nameOnChange(rule:Rule, rulesStore:RulesStore, value){
    rule.name = value 
    rulesStore.updDevice({_id:rule._id, name:rule.name})
 }


}
