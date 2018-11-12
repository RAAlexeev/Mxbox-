import { observable, action } from 'mobx'
import gql from 'graphql-tag'
import { AppStore } from '../../app.store'
import { arrayRemove } from '../../utils';
import { Device } from '../../devices/devices.store';



  

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
interface Trig{
  type:number
  condition?:string
  sms?:Sms
  email?:Email
  cron?:string
}
interface Sms{
  number:string[]
  text:string
}
interface Email{
  addr:string
  subj:string
  body?:string
}
export interface Rule {
  trigs?:Trig[]
  smss?: Sms[]
  email?: Email[]
}

interface RulesQueryResult {
  trigs?: Array<Trig>
  rule?:Rule
}

export class TrigsStore {
  appStore: AppStore
 // deviceSubscription

  @observable trigs: Array<Trig> = []

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

  async initializeTrigs(device:Device,ruleNum:number) {
    try{
     const result = await this.appStore.apolloClient.query<any,any>({
      query: gql`query trigs($device:ID!, $ruleNum:Int!){trigs(device:$device,ruleNum:$ruleNum)[]}`,
        variables:{
         device:device._id,
         ruleNum:ruleNum
        },
        fetchPolicy: 'network-only'
      }) 
    this.trigs = result.data
    }catch(err){
      this.trigs=[] 
    }
    //console.log(result.data.rules)

  }
  @action async addTrig(device:Device,ruleNum:number) {
      const result = await this.appStore.apolloClient.mutate<RulesQueryResult,{}>({
      mutation: gql`mutation addRule($device:ID!){addRule(device:$device){status}}`,
      variables:{device:device._id},
      fetchPolicy: 'no-cache'  
    }) 
     
  
    this.trigs.push(result.data.addRule)
  }
/*   async delRule(rule) {
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
    
  } */



}
