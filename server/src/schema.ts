import gql from 'graphql-tag'

// The GraphQL schema
 export const typeDefs = gql(`\
    type Sms{
      enabled:Boolean
      numbers:[String]!
      text:String! 
    }
    type Email{
      enabled:Boolean
      address:String!
      subject:String!
      body:String
    }
   type Trig{
     type:Int!
     condition:String 
     inSms:Sms 
     inEmail:Email
     cron:String 
   }
    type Rule{
      enabled:Boolean
      trigs:[Trig]
      smss:[Sms] 
      emails:[Email] 
    }
    input SmsInput{
      enabled:Boolean
      numbers:[String]
      text:String  
    }
   input EmailInput{
    enabled:Boolean
    address:String!
    subject:String!
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
    type Query {
      devices:[Device]
      rules(device:ID!):[Rule]
      trigs(device:ID!,numRule:Int!):[Trig]
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
      delRule(device:ID!,num:Int):Result
      addTrig(device:ID!,trigInput:TrigInput!,numRule:Int!):Result
      addSms(rule:ID!):Sms
      addEmail(rule:ID!):Email
      updateSms(rule:ID!):Sms
    }
`);
import * as Datastore from 'nedb';

var db = new Datastore({filename : 'db.json'});
db.loadDatabase();
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

 export const resolvers = {
  Query: {
    devices: (parent) => {
      var callback = function(err,dev){ if( err ){ console.log(err); this.reject(err)} else this.resolve(dev) }         
      const p = new Promise((resolve,reject)=>{db.find( {}, callback.bind({resolve,reject}))})    
      return p.then().catch()   
    },
    rules: (parent, args) => {
      var callback = function(err,dev){   /*console.log("callback(",dev,")"); */  if( err ){ console.log(err); this.reject(err)} else this.resolve(((dev[0]&&dev[0].rules)?dev[0].rules:[])) }         
      const p = new Promise((resolve,reject)=>{db.find( {_id:args.device }, callback.bind({resolve,reject}))})    
      return p.then().catch()   
    },  
    trigs:(parent, args)=>{
      var callback = function(err, dev){   /*console.log("callback(",dev,")"); */  if( err ){ console.log(err); this.reject(err)} else this.resolve(((dev[0]&&dev[0].rules)?dev[0].rules[this.numRule].trigs:[])) }         
      const p = new Promise((resolve,reject)=>{db.find( {_id:args.device }, callback.bind({resolve,reject,numRule:args.numRule}))})    
      return p.then().catch()         
    }
  },
  Mutation:{
      addDevice(parent,args,context,info){
            var callback = function( err, dev){ if( err ){ console.log(err); this.reject(err)} else this.resolve(dev) }         
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
        const p = new Promise((resolve,reject)=>{db.update<void>({_id:args.device}, {$push:{rules:{enabled:false, trigs:[]}}},{}, callback.bind({resolve,reject}))})    
        return p.then().catch()    
      },
      updRule(parent,args,context,info){
        var callback = function(err, device ){/* console.log("callback(",arguments,")"); */ if(err){ console.log(err); this.reject({status:err})} else this.resolve({status:device?'OK':'not found'}) }         
        const p = new Promise((resolve,reject)=>{db.update<void>({_id:args.device}, args.ruleInput, {}, callback.bind({resolve,reject}))})    
        return p.then().catch()    
      },
      delRule(parent,args,context,info){
        var callback = function(err, cnt ){/* console.log("callback(",arguments,")"); */ if(err){ console.log(err); this.reject({status:err})} else this.resolve({status:"OK"}) }         
        const p = new Promise((resolve,reject)=>{db.remove({_id:args.device}, callback.bind({resolve,reject}))})    
        return p.then().catch()    
      },
      addTrig(parent,args,context,info){
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
      },
      
  }   
}
