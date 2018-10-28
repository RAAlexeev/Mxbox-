import gql from 'graphql-tag'

// The GraphQL schema
 export const typeDefs = gql(`\
    type Sms{
      _id:ID!
      enabled:Boolean
      numbers:[String]!
      text:String! 
    }
    type Email{
      _id:ID!
      enabled:Boolean
      address:String!
      subject:String!
      body:String
    }
    type Rule{
      _id:ID!
      enabled:Boolean
      condition:String
      smss:[Sms] 
      emails:[Email] 
    }
    type Device{
        name:String!
        mb_addr: Int
        _id: ID!
        ip_addr: String
        rules:[Rule]
        
    }
    input DeviceInput
    {
      name:String
      mb_addr:Int
      ip_addr:String
    }
    type Query {
      devices:[Device]
      rules:[Rule]
      device(id:ID!):Device
    }
    type Result{
      status:String
    }
    type Mutation{
      addDevice(device:DeviceInput!):Device
      updDevice(_id:ID!,device:DeviceInput!):Device
      delDevice(_id:ID):Result
      addRule(device:ID!):Rule
      updateConditoin(rule:ID!):String
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
      var callback = function(err,dev){ if(err){ console.log(err); this.reject(err)} else this.resolve(dev) }         
      const p = new Promise((resolve,reject)=>{db.find( {}, callback.bind({resolve,reject}))})    
      return p.then().catch()   
    }
  },
  Mutation:{
      addDevice(parent,args,context,info){
            var callback = function(err,dev){ if(err){ console.log(err); this.reject(err)} else this.resolve(dev) }         
            const p = new Promise((resolve,reject)=>{db.insert( args.device, callback.bind({resolve,reject}))})    
            return p.then().catch()     
       },
      updDevice(parent,args,context,info){
          var callback = function(err, numAffected, affectedDocuments, upsert){/* console.log("callback(",arguments,")"); */ if(err){ console.log(err); this.reject(err)} else this.resolve(affectedDocuments) }         
          const p = new Promise((resolve,reject)=>{db.update<void>({_id:args._id}, args.device,{returnUpdatedDocs:true}, callback.bind({resolve,reject}))})    
          return p.then().catch()    
      },
      delDevice(parent,args,context,info){
        var callback = function(err, cnt ){/* console.log("callback(",arguments,")"); */ if(err){ console.log(err); this.reject({status:err})} else this.resolve({status:"OK"}) }         
        const p = new Promise((resolve,reject)=>{db.remove({_id:args._id}, callback.bind({resolve,reject}))})    
        return p.then().catch()    
      },
      addRule(parent,args,context,info){
        var callback = function(err, cnt ){/* console.log("callback(",arguments,")"); */ if(err){ console.log(err); this.reject({status:err})} else this.resolve({status:"OK"}) }         
        const p = new Promise((resolve,reject)=>{db.update<void>({_id:args.device}, callback.bind({resolve,reject}))})    
        return p.then().catch()    
      },

  }   
}
