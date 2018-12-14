import { observable, computed, action } from 'mobx'

export class SettingsStore {
  @observable smtpAddress:string = ''
  @observable smtpPort:string=''
  @observable smtpName:string=''
  @observable smtpPassword:string=''
  onSmtpChange =(name,value)=>{
    this[name]=value
  }
/*   @observable counter = 0
  increment = () => {
    this.counter++
  }
  @computed get counterMessage() {
    console.log('recompute counterMessage!')
    return `${this.counter} ${this.counter === 1 ? 'click' : 'clicks'} since last visit`
  } */
}
