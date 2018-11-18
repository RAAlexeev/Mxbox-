import * as React from 'react'
import { inject, observer, Provider } from 'mobx-react'
import { Card,  CardTitle, CardText, CardActions } from 'react-toolbox/lib/card'
import {  Redirect } from 'react-router-dom'
import { Button } from 'react-toolbox/lib/button'
import { RulesStore } from './rules.store'
import { AppStore } from '../app.store'
import * as style from './devices.css'
import * as appStyle from '../app.css'
import { DevicesStore } from '../devices/devices.store';
import { Trigs } from './trigs/trigs.component';
import { TrigsStore } from './trigs/trigs.store';
import { CodeDialog } from './dialogs/code.dialog';
import { EmailDialog } from './dialogs/email.dialog';
import {Acts} from './acts/acts.component'
import { ActsStore } from './acts/acts.store';
import { SmsDialog } from './dialogs/sms.dialog';



@inject('appStore','devicesStore')
@observer
export class DevRules extends React.Component<any, any> {

  rulesStore: RulesStore

  componentWillMount() {
    const { appStore, devicesStore} = this.props 
    this.rulesStore = new RulesStore()
    //console.log(this.props.devicesStore);
    if(this.props.devicesStore.selected){
      this.props.devicesStore.rulesStore = this.rulesStore;
      this.rulesStore.initializeRules(this.props.devicesStore.selected)
    }
  }

  componentWillUnmount() {
     this.rulesStore.destructor()
  }

  render() {  //this.rulesStore = new RulesStore()
    //this.rulesStore.initializeRules(this.props.devicesStore.selected)
   
    return <Provider rulesStore={this.rulesStore}>
 
    <RulesComponent {...this.props} />
    </Provider>
  }
   
}

interface RulesComponentProps {
  appStore?: AppStore,
  rulesStore?: RulesStore,
  devicesStore?:DevicesStore,
  match?:any
}

@inject('appStore','rulesStore','devicesStore')
@observer
export class RulesComponent extends React.Component<RulesComponentProps, any> {
  codeDialog:CodeDialog; 
  emailDialog:EmailDialog;
  smsDialog:SmsDialog;
  //onRef: React.RefObject<{}>;
  
   render() {
  
    const { rulesStore, appStore, devicesStore } = this.props 
   
    const { name } = this.props.match.params
  
     return !devicesStore.selected?<Redirect to='/home' />:<div>
        <CodeDialog onRef={instance => { this.codeDialog = instance }} />  
        <EmailDialog onRef={instance => { this.emailDialog = instance }} />  
        <SmsDialog onRef={instance => { this.smsDialog = instance }} />  
        <Button icon='add' onClick={rulesStore.addRule.bind(rulesStore, devicesStore.selected)} floating accent mini className={appStyle.floatRight} />
        <h2>{'Правила для: '+ devicesStore.selected.name}</h2>
        {rulesStore.rules.map((rule,index) =>rule?
       
          <Card key={index} className={style.messageCard}>
         <h3 style={{margin:'0px'}}>{'#' + index} <Button icon='delete' onClick={rulesStore.delRule.bind(rulesStore, devicesStore.selected,index)} floating  mini className={appStyle.floatRight} /></h3> 
            <CardTitle className ={style.cardTitle}
              
              subtitle=''/>            
            <CardText> 
            <h3 style={{margin:'0px'}}>События: { Trigs(new TrigsStore(rule, index, {codeDialog: this.codeDialog})) }</h3> 
            <h3 style={{margin:'0px'}}>Действия: { Acts(new ActsStore(rule, index, {emailDialog: this.emailDialog,smsDialog: this.smsDialog})) } </h3> 
            </CardText>
          </Card>      
        :'')}
    </div>
  }
}
