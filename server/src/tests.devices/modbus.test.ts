import node_modbus from 'node-modbus'
import {db, pubsub, LINK_STATE_CHENG} from '../schema' 

export const run = ()=>{
setInterval(()=> 
    db.find({'rules.trigs.type':0}
            ,(err,devices:Device[])=>{
                        const time_interval = 1000*60
                        let intervals:any[]=[] 
                            intervals.forEach(interval =>{clearInterval(interval)})
                            intervals=[]      
                            if(!err)  
                                devices.forEach(device => {
                                    let client = node_modbus.client.tcp.complete({
                                        'host': device.ip_addr?device.ip_addr.replace(/:\d+/g,''):'localhost', /* IP or name of server host */
                                        'port': device.ip_addr?device.ip_addr.replace(/.*:/g,''):'501', /* well known Modbus port */
                                        'unitId': device.mb_addr, 
                                        'timeout': 2000, /* 2 sec */
                                        'autoReconnect': true, /* reconnect on connection is lost */
                                        'reconnectTimeout': 15000, /* wait 15 sec if auto reconnect fails to often */
                                        'logLabel' : 'ModbusClientTCP', /* label to identify in log files */
                                        'logLevel': 'debug', /* for less log use: info, warn or error */
                                        'logEnabled': false
                                    })
                                    pubsub.publish(LINK_STATE_CHENG, { deviceLinkState:{ _id:device._id, state:'нет соединения' }  });
                                    client.connect()
                                    client.on( 'connect', function () {
                                        pubsub.publish(LINK_STATE_CHENG, { deviceLinkState:{ _id:device._id, state:'' }  });
                                            intervals.push(  setInterval( function () {
                                                                            TestDevicesModbus.testTrigs(device,client) 
                                                                            // client.readCoils(0, 13).then((response) => console.log(response.payload))
                                                                            //}, time_interval) /* reading coils every second */
                                                                        }, time_interval ) 
                                            )       
                                    })
                                
                                })
                            else console.error(err.toString())
                        
                        })
,1000*30)}

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
    regs?:Reg[]
  }
   interface Rule {
    trigs?:Trig[]
    smss?: Sms[]
    email?: Email[]
  }
interface Device{
    _id:string
    name:string 
    mb_addr:number
    ip_addr:string
    rules:Rule[]
}
interface Reg{
    func:number
    addr:number
    val?:number
    pattern:string
    qualifier:string
}



class TestDevicesModbus {

    constructor(){
       
    }
    private static parse (s:string):Reg[]{   
        const regs:Reg[] = []  
        const match = s.match(/\[(\d+)\s+(\d+)\.?(\d?(?<=\d)[\d,f,u]?)\]/g)
        if(match)    
            for (let i = 0; i < match.length; i++) {
                regs.push({
                    pattern:match[i],//0
                    func:parseInt(match[++i],16),//1
                    addr:parseInt(match[++i],10),//2
                    qualifier:match[++i]//3
                })
                
            }

            return regs
    }

    private static modbusError(err,device){
        pubsub.publish(LINK_STATE_CHENG, { deviceLinkState:{ device:device, state:err.toString() }  });
            console.error(err.toString())
    }
    private static onTrig(rule:Rule){
    
            //send SMSs Emails
    }
    private static testTrig (trig:Trig):boolean{
            let jsCode
            if(trig && trig.regs){
             trig.regs.forEach(reg => {
                if(trig.condition && reg && reg.val)
                  jsCode = trig.condition.replace(reg.pattern,'('+reg.val.toString()+')') 
                });
            try{
                return new Function(jsCode)()    
            }catch(err){
                console.error(err.toString())
            }

            }    
            return false
    }
        
    private static getSizeDataReguest(reg:Reg):number{
        if(reg.qualifier)
         if( reg.qualifier.search(/f/) ) return 2
         
        return 1
    }    
    private static processResponse(resp, reg:Reg){
        if (!reg.qualifier) {
           reg.val =new Int16Array( resp.register[0] )[0] 
        } else 
            if(reg.qualifier.search(/u/)){
                 reg.val = resp.register[0]
            }else
                if(this.getSizeDataReguest(reg) === 2){
                    if(resp.register.length === 2)
                
                         reg.val =  new Float32Array(new Uint16Array([resp.register[0],resp.register[1]]).buffer)[0]

                    else console.error('запрашивал 2 регистра получено не 2...  ')
                }else{          
               const bit = parseInt(reg.qualifier)
               reg.val = ((resp.register[0] & (1<<bit)) >> bit )         
            }
        
    }    
    static testTrigs (device:Device, client){
            device.rules.forEach(rule =>{
                if(rule.trigs)
                    rule.trigs.forEach(trig=>{
                        if(trig){
                            if ( trig.condition ){
                                trig.regs =  this.parse(trig.condition)
                                trig.regs.forEach(reg=>{
                                    switch(reg.func){                                    
                                        case 1: client.readCoils(reg.addr,1)
                                                        .then(resp=>{this.processResponse(resp, reg)},resp=>this.modbusError.bind(this,resp,device) )
                                        break 
                                        case 1: client.readCoils(reg.addr,1)
                                                        .then(resp=>{this.processResponse(resp, reg)},resp=>this.modbusError.bind(this,resp,device) )
                                        break
                                        case 3: client.readHoldingRegisters(reg.addr, this.getSizeDataReguest(reg))
                                                        .then(resp=>{this.processResponse(resp,reg)}, resp=>this.modbusError.bind(this,resp,device)  )
                                        break
                                        case 4: client.readInputRegisters(reg.addr, 1)
                                                        .then(resp=>{this.processResponse(resp, reg)},resp=>this.modbusError.bind(this, resp,device ) ) 
                                        break 
                                        default: console.error('Неподдержаная функция модбаса или парсер не распарсил!')                                            
                                    }
                                },this)
                                if(this.testTrig(trig)) this.onTrig(rule)
                            }
                        }
                    },this)
                    
                },this)
            

     }
}

  
