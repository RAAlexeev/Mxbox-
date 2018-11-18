import gql from 'graphql-tag'
import { AppStore } from '../../app.store'
import { arrayRemove } from '../../utils';
import { Device, DevicesStore } from '../../devices/devices.store';
import { Rule } from '../rules.store';
import { observable, action } from 'mobx';



  

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
  numbers:string[]
  text:string
}
interface Email{
  address:string
  subject:string
  body?:string
}
export interface Act{
  type?:number
  sms?:Sms
  email?:Email
  index?:number
}

interface RulesQueryResult {
  rule?:Rule
}


export class ActsStore {
  appStore:AppStore = AppStore.getInstance()
  devicesStore:DevicesStore = DevicesStore.getInstance()
 // deviceSubscription
  dialogs
  ruleNum:number
  rule:Rule
  @observable acts: Array<Act>=[]

  constructor(rule:Rule, ruleNum:number, dialogs) {
    let self = this
    this.ruleNum = ruleNum
    this.acts = rule.acts
    this.rule = rule
    this.dialogs = dialogs
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

 
  
  @action addAct = async (act:Act)=>{
    try{
    const result = await this.appStore.apolloClient.mutate<RulesQueryResult,{}>({
      mutation: gql`mutation addAct($device:ID!,$ruleNum:Int!,$actInput:ActInput!){addAct(device:$device,ruleNum:$ruleNum,actInput:$actInput){status}}`,
      variables:{
        device:this.devicesStore.selected._id,
        ruleNum:this.ruleNum,
        actInput:act
      },
      fetchPolicy: 'no-cache'  
    }) 
    this.acts.push(act)
    }catch(err){
      console.error(err.toString())
    }
  }
  @action updActEmail = async (act:Act)=>{
  // let index = this.acts.findIndex((val,index)=>(val===act))

   try{
    
      const result = await this.appStore.apolloClient.mutate<RulesQueryResult,{}>({
      mutation: gql`mutation updAct($device:ID!,$ruleNum:Int!,$actNum:Int!,$actInput:ActInput!){updAct(device:$device,ruleNum:$ruleNum,actNum:$actNum,actInput:$actInput){ type email{address subject body} sms{numbers text}}}`,
      variables:{
        device:this.devicesStore.selected._id,
        ruleNum:this.ruleNum,
        actNum:act.index,
        actInput:{type:act.type, email:{address:act.email.address,subject:act.email.subject,body:act.email.body}}
      },
      fetchPolicy: 'no-cache'  
    })
    //console.log(result.data)
    this.acts[act.index] = result.data.updAct
  
    return true 
    }catch(err){
      console.error(err.toString())
      return false
    }
  }
  @action updActSms = async (act:Act)=>{
    // let index = this.acts.findIndex((val,index)=>(val===act))
  
     try{
        const result = await this.appStore.apolloClient.mutate<RulesQueryResult,{}>({
        mutation: gql`mutation updAct($device:ID!,$ruleNum:Int!,$actNum:Int!,$actInput:ActInput!){updAct(device:$device,ruleNum:$ruleNum,actNum:$actNum,actInput:$actInput){ type email{address subject body} sms{numbers text}}}`,
        variables:{
          device:this.devicesStore.selected._id,
          ruleNum:this.ruleNum,
          actNum:act.index,
          actInput:{type:act.type, sms:{numbers:act.sms.numbers,text:act.sms.text}}
        },
        fetchPolicy: 'no-cache'  
      })
     // console.log(result.data,act.index)
      this.acts[act.index] = result.data.updAct
    
      return true 
      }catch(err){
        console.error(err.toString())
        return false
      }
    }
  @action  delAct = async (actNum:number)=>{
    try{
    const result = await this.appStore.apolloClient.mutate<RulesQueryResult,{}>({
      mutation: gql`mutation delAct($device:ID!,$ruleNum:Int!,$actNum:Int!){delAct(device:$device,ruleNum:$ruleNum,actNum:$actNum){status}}`,
      variables:{
        device:this.devicesStore.selected._id,
        ruleNum:this.ruleNum,
        actNum:actNum
      },
      fetchPolicy: 'no-cache'  
    }) 
    this.rule.acts[actNum] = null
    }catch(err){
      console.error(err.toString())
    }
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
