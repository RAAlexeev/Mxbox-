import { observable, action } from 'mobx'
import gql from 'graphql-tag'
import { AppStore } from '../app.store'
import { arrayRemove } from '../utils';
import { DeviceState } from './device.state';

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

interface Device {
  _id: string
  name: string
  mb_addr?: number
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
      mutation: addDevice,
      fetchPolicy: 'no-cache'  
    })
   console.log(result.data)  
  
    this.devices.push(result.data.addDevice)
  }
  async delDevice(device) {
    const result = await this.appStore.apolloClient.mutate<DevicesQueryResult,{}>({
      mutation: gql`mutation delDevice($_id:ID) { delDevice(_id:$_id){status}}`,
      variables:{ _id:device._id },
      fetchPolicy: 'no-cache'  
    })
    
    arrayRemove.call(this.devices, this.devices.indexOf(device))
  }

  async updDevice(value) {
    const result = await this.appStore.apolloClient.mutate<DevicesQueryResult,{}>({
      mutation: gql`mutation updDevice($deviceInput:DeviceInput!) { updDevice(deviceInput:$deviceInput){status}}`,
      
      variables:{ deviceInput:value },
      fetchPolicy: 'no-cache'  
    })
    
  }
  nameOnChange(device:Device, deviceStore:DevicesStore, value){
    device.name = value 
    deviceStore.updDevice({_id:device._id, name:device.name})
 }
 mb_addrOnChange(device:Device, deviceStore:DevicesStore, value){
 // if (!value.search(/\d+/g))  return;
  if(value){
   // console.log(value)
  device.mb_addr = parseInt(value.replace(/[^\d]*/g,'')) ;
  //device.ip_addr = value.match(/(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/g)
  }else
  device.mb_addr = 0
 
  deviceStore.updDevice({_id:device._id, mb_addr:device.mb_addr})
}


ip_addrOnChange(device:Device,deviceStore:DevicesStore,value){

   let val = value.replace(/[^\d.]*/g,'').replace(/(\d{3})[^\.]?/g,'$1\.').replace(/\.+/g,'.')
  
      if(val.length > 0) 
      {     
        var ip = val.split('.')
        val = '';
        for(let i = 0; i < ip.length && i < 4; ++i){
          if(parseInt(ip[i]) > 255) ip[i] = "255";
          val  += ip[i]
           if(i>2) break;
           if( ip[i].length > 2) val += '.'
           if((ip[i].length < 3 && ip[i+1] != undefined)||!ip[i].length) val += '.' 
          //if(i > 0 && ip[i].length > 2 )ip[i]='.'+ip[i]
        }
       // if(ip.length < 4  ) ip.push('.')
      }

      console.log(ip)
    device.ip_addr =val.replace(/\.+/g,'.')// ip?(ip[0]+(ip[1]||ip[1].isEmpty?'.'+ip[1]:'')+(ip[2]?ip[2]:'') + (ip[3]?ip[3]:'')):val//value.replace(/[^\d,.]*/g,'').replace(/(\d{3})\d+/g,'$1\.');
    deviceStore.updDevice({_id:device._id, ip_addr:device.ip_addr})
}
}
