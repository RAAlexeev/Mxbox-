import gql from 'graphql-tag'

// The GraphQL schema
 export const typeDefs = gql(`\

    type Sms{
      enabled:Boolean
      numbers:[String]
      text:String 
    }
    type Email{
      enabled:Boolean
      address:String
      subject:String
      body:String
    }
   type Trig{
     type:Int!
     condition:String 
     inSms:Sms 
     inEmail:Email
     cron:String 
   }
   type Act{
     type:Int!
     sms:Sms
     email:Email
   }
    type Rule{
      enabled:Boolean
      trigs:[Trig]
      acts:[Act]
    }
    input SmsInput{
      enabled:Boolean
      numbers:[String]
      text:String  
    }
   input EmailInput{
    enabled:Boolean
    address:String
    subject:String
    body:String
   }
    input TrigInput{
      enabled:Boolean
      type:Int!
      condition:String
      inSms:SmsInput
      inEmail:EmailInput
      cron:String
    }
    input ActInput{
      type:Int!
      sms:SmsInput
      email:EmailInput
    }
    input RuleInput{
        enabled:Boolean
    }
    type Device{
        name:String
        mb_addr: Int
        _id: ID!
        ip_addr: String
        rules:[Rule]!
        
    }
    input DeviceInput
    {
      _id:ID
      name:String
      mb_addr:Int
      ip_addr:String
    }
    type  DeviceLinkState{
      _id:ID
      linkState:String
    }
    type Subscription {
      deviceLinkState:DeviceLinkState
    }
    type Query {
      devices:[Device]
      rules(device:ID!):[Rule]
      device(id:ID!):Device
    }
    type Result{
      status:String
    }
    type Mutation{
      addDevice(device:DeviceInput!):Device
      updDevice(deviceInput:DeviceInput!):Result
      delDevice(_id:ID):Result
      addRule(device:ID!):Result
      updRule(device:ID!,ruleInput:RuleInput!,num:Int!):Rule
      delRule(device:ID!,ruleNum:Int!):Result
      addTrig(device:ID!,trigInput:TrigInput!,ruleNum:Int!):Result
      updTrig(device:ID!,ruleNum:Int!,trigNum:Int!,trigInput:TrigInput):Result
      delTrig(device:ID!,ruleNum:Int!,trigNum:Int!):Result 
      addAct(device:ID!,actInput:ActInput!,ruleNum:Int!):Result
      updAct(device:ID!,ruleNum:Int!,actNum:Int!,actInput:ActInput):Act!
      delAct(device:ID!,ruleNum:Int!,actNum:Int!):Result 
    }
`);
import * as Datastore from 'nedb';

export var db = new Datastore({filename : 'db'});
db.loadDatabase();
interface Sms{
  number:string[]
  text:string
}
interface Email{
  addr:string
  subj:string
  body?:string
}
export interface Trig{
  type:number
  condition?:string
  sms?:Sms
  email?:Email
  cron?:string
}
export interface Act{
  type:number
  sms?:Sms
  email?:Email
}
export interface Rule {
  trigs?:Array<Trig>
  acts?:Array<Act>
}
// A map of functions which return data for the schema.
/* interface DeviceInput{
  name
  mb_addr
  ip_addr?
}
class Device implements DeviceInput{
    _id
    name:'новое'
    mb_addr:1
    ip_addr?
  constructor(device){
    //console.log('addDevice.constructr:(' + util.inspect(device)+')')
    this._id = device._id
    this.name = device.name
    this.mb_addr = device.mb_addr
    if(device.ip_addr)
      this.ip_addr = device.ip_addr

  }
} */
//import * as util from 'util'

 import  { PubSub } from 'apollo-server-express'
import { GraphQLSchema } from 'graphql';
 export const LINK_STATE_CHENG = 'LINK_STATE_CHENG' 
 export const pubsub = new PubSub();
 export const resolvers = {
  Subscription:{
    deviceLinkState:{
      subscribe:()=>pubsub.asyncIterator([LINK_STATE_CHENG])
    }
  } ,
  Query: {
    devices: (parent) => {
      var callback = function(err,dev){ if( err ){ console.log(err); this.reject(err.toString())} else this.resolve(dev) }         
      const p = new Promise((resolve,reject)=>{db.find( {}, callback.bind({resolve,reject}))})    
      return p.then().catch()   
    },
    rules: (parent, args) => {
      var callback = function(err,dev){   /*console.log("callback(",dev,")"); */  if( err ){ console.log(err); this.reject(err)} else this.resolve(((dev[0]&&dev[0].rules)?dev[0].rules:[])) }         
      const p = new Promise((resolve,reject)=>{db.find( {_id:args.device }, callback.bind({resolve,reject}))})    
      return p.then().catch()   
    },  
    // trigs:(parent, args)=>{
    //   var callback = function(err, dev){   /*console.log("callback(",dev,")"); */  if( err ){ console.log(err); this.reject(err)} else this.resolve(((dev[0]&&dev[0].rules)?dev[0].rules[this.numRule].trigs:[])) }         
    //   const p = new Promise((resolve,reject)=>{db.find( {_id:args.device }, callback.bind({resolve,reject,num:args.num}))})    
    //   return p.then().catch()         
    // }
  },
  Mutation:{
      addDevice(parent,args,context,info){
          
            var callback = function( err, dev){ if( err ){ console.log(err); this.reject(err)} else this.resolve(dev) }  
            if(!args.device.rules)  args.device.rules = []       
            const p = new Promise((resolve,reject)=>{db.insert( args.device, callback.bind({resolve,reject}))})    
            return p.then().catch()     
       },
      updDevice(parent,args,context,info){
          var callback = function(err, numAffected, affectedDocuments, upsert){/* console.log("callback(",arguments,")"); */ if(err){ console.log(err); this.reject(err)} else this.resolve("OK") }         
          const p = new Promise((resolve,reject)=>{db.update<void>({_id:args.deviceInput._id}, {$set:args.deviceInput},{}, callback.bind({resolve,reject}))})    
          return p.then().catch()    
      },
      delDevice(parent,args,context,info){
        var callback = function(err, cnt ){/* console.log("callback(",arguments,")"); */ if(err){ console.log(err); this.reject({status:err})} else this.resolve({status:"OK"}) }         
        const p = new Promise((resolve,reject)=>{db.remove({_id:args._id}, callback.bind({resolve,reject}))})    
        return p.then().catch()    
      },

      addRule(parent,args,context,info){
        var callback = function(err, device ){/* console.log("callback(",arguments,")"); */ if(err){ console.log(err); this.reject({status:err.toString()})} else this.resolve({status:device?'OK':'not found'}) }         
        const p = new Promise((resolve,reject)=>{db.update<void>({_id:args.device}, {$push:{rules:{enabled:false, trigs:[], acts:[]}}},{}, callback.bind({resolve,reject}))})    
        return p.then().catch()    
      },

      updRule(parent,args,context,info){
        var callback = function(err, device ){/* console.log("callback(",arguments,")"); */ if(err){ console.log(err); this.reject({status:err})} else this.resolve({status:device?'OK':'not found'}) }      
        const p = new Promise((resolve,reject)=>{db.update<void>({_id:args.device}, args.ruleInput, {}, callback.bind({resolve,reject}))})    
        return p.then().catch()    
      },
      delRule(parent,args,context,info){
        var callback = function(err, numberUpdated ){/* console.log("callback(",arguments,")"); */ if(err){ console.log(err); this.reject({status:err})} else this.resolve({status:"OK:"+numberUpdated}) }         
        const p = new Promise((resolve,reject)=>{db.update({_id:args.device},{$unset:{['rules.'+args.ruleNum]:undefined}},{}, callback.bind({resolve,reject}))})    
        return p.then().catch()    
      },

     
      addTrig(parent,args,context,info){
        var callback = function(err, numberUpdated ){/* console.log("callback(",arguments,")"); */ if(err){ console.log(err.toString()); this.reject({status:err.toString()})} else this.resolve({status:'OK:'+numberUpdated}) }            
        const p = new Promise((resolve,reject)=>{db.update<void>({_id:args.device}, {$push:{['rules.'+args.ruleNum+'.trigs']:args.trigInput}}, {}, callback.bind({resolve,reject}))})    
        return p.then((v)=>v).catch((v)=>v)    
      },
      updTrig(parent,args,context,info){
        var callback = function(err, numberUpdated ){/* console.log("callback(",arguments,")"); */ if(err){ console.log(err.toString()); this.reject({status:err.toString()})} else this.resolve({status:'OK:'+numberUpdated}) }            
        const p = new Promise((resolve,reject)=>{db.update<void>({_id:args.device}, {$set:{['rules.'+args.ruleNum+'.trigs.'+ args.trigNum]:args.trigInput}}, {}, callback.bind({resolve,reject}))})    
        return p.then((v)=>v).catch((v)=>v)    
      },
      delTrig(parent,args,context,info){
        var callback = function(err, numberUpdated ){/* console.log("callback(",arguments,")"); */ if(err){ console.log(err.toString()); this.reject({status:err.toString()})} else this.resolve({status:'OK:'+numberUpdated}) }            
        const p = new Promise((resolve,reject)=>{db.update<void>({_id:args.device}, {$unset:{['rules.'+args.ruleNum+'.trigs.'+ args.trigNum]:undefined}}, {}, callback.bind({resolve,reject}))})    
        return p.then((v)=>v).catch((v)=>v)    
      },
           
      addAct(parent,args,context,info){
        var callback = function(err, numberUpdated ){/* console.log("callback(",arguments,")"); */ if(err){ console.log(err.toString()); this.reject({status:err.toString()})} else this.resolve({status:'OK:'+numberUpdated}) }            
        const p = new Promise((resolve,reject)=>{db.update<void>({_id:args.device}, {$push:{['rules.'+args.ruleNum+'.acts']:args.actInput}}, {}, callback.bind({resolve,reject}))})    
        return p.then((v)=>v).catch((v)=>v)    
      },
      updAct(parent,args,context,info){
        var callback = function(err, numberUpdated, affectedDocuments ){ console.log("callback(",affectedDocuments.rules[args.ruleNum].acts,")");  if(err){ console.log(err.toString()); this.reject({status:err.toString()})} else if(numberUpdated) this.resolve(affectedDocuments.rules[args.ruleNum].acts[args.actNum]); else this.resolve(null) }            
        const p = new Promise((resolve,reject)=>{db.update<void>({_id:args.device}, {$set:{['rules.'+args.ruleNum+'.acts.'+ args.actNum]:args.actInput}}, {returnUpdatedDocs:true}, callback.bind({resolve,reject}))})    
        return p.then((v)=>v).catch((v)=>v)    
      },
      delAct(parent,args,context,info){
        var callback = function(err, numberUpdated ){/* console.log("callback(",arguments,")"); */ if(err){ console.log(err.toString()); this.reject({status:err.toString()})} else this.resolve({status:'OK:'+numberUpdated}) }            
        const p = new Promise((resolve,reject)=>{db.update<void>({_id:args.device}, {$unset:{['rules.'+args.ruleNum+'.acts.'+ args.actNum]:undefined}}, {}, callback.bind({resolve,reject}))})    
        return p.then((v)=>v).catch((v)=>v)    
      }

      /*       addTrig(parent,args,context,info){
        var callback = function(err, device){ 
          if(err) {
            console.log(err); this.reject({status:err.toString()})
          }else
          if(device){
            
           // console.log(device,args.numRule)
           if( !device.rules[args.numRule].trigs )device.rules[args.numRule].trigs=[]

               
            
            device.rules[args.numRule].trigs.push(args.trigInput)
            db.update({_id:device._id},device,{}, function(err,numberUpdated){
              if(err){
                console.dir(err); this.reject({status:err.toString()})
              } else {
                console.log("OK:"+numberUpdated)
                this.resolve({status:"OK:"+numberUpdated})
              }
            }.bind(this))
          }else{
          console.log(device); this.reject({status:'not found device'})
         } 
        }        
        const p = new Promise((resolve,reject)=>{
          db.findOne({_id:args.device},callback.bind({resolve,reject}))
        //  db.update<void>({_id:args.device}, {$push:{rules:{enabled:false}}},{}, callback.bind({resolve,reject}))
        })    
        return p.then((v)=>v).catch((v)=>v)    
      }, */
      
  }   
}
