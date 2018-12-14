import * as React from 'react'
import { inject, observer, Provider } from 'mobx-react'
import { Card,  CardTitle, CardText, CardActions } from 'react-toolbox/lib/card'
import {  Redirect } from 'react-router-dom'
import { Button } from 'react-toolbox/lib/button'
import { RulesStore } from './rules.store'
import { AppStore } from '../app.store'
import * as style from './rules.css'
import * as appStyle from '../app.css'
import { DevicesStore } from '../devices/devices.store';
import { Trigs } from './trigs/trigs.component';
import { TrigsStore } from './trigs/trigs.store';
import { CodeDialog } from './dialogs/code.dialog';
import { EmailDialog } from './dialogs/email.dialog';
import { Acts } from './acts/acts.component'
import { ActsStore } from './acts/acts.store';
import { SmsDialog } from './dialogs/sms.dialog';
import {TemplateMenu } from './contextenu.componet'
import { TemplatesStore } from './templates.store';
import Tooltip from 'react-toolbox/lib/tooltip';
import { CronDialog } from './dialogs/cron.dialog';
import './style.css'
const TooltipButton = Tooltip( Button )
@inject('appStore','devicesStore')
@observer
export class DevRules extends React.Component<any, any> {

  rulesStore: RulesStore

  componentWillMount() {
    const { appStore, devicesStore } = this.props 
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

  render() {  
    return <Provider rulesStore = { this.rulesStore }>
      <RulesComponent { ...this.props } />
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
  cronDialog:CronDialog;
  
  
   render() {
  
    const { rulesStore, appStore, devicesStore } = this.props 
   
    const { name } = this.props.match.params
  
     return !devicesStore.selected?<Redirect to='/home' />:<div>
        <CodeDialog ref={instance =>  this.codeDialog = instance } />  
        <EmailDialog ref={instance =>  this.emailDialog = instance } />  
        <SmsDialog ref={instance =>  this.smsDialog = instance } />   
        <CronDialog ref = {instance=>this.cronDialog = instance}  />
        { TemplateMenu( TemplatesStore.getInstance(), devicesStore, rulesStore ) } 
        <TooltipButton tooltip='Добавить' icon='add' onClick={rulesStore.addRule.bind( rulesStore, devicesStore.selected )} floating accent mini className={appStyle.floatRight} />
        <h2>{'Правила для: ' + devicesStore.selected.name}</h2>
        { rulesStore.rules.map((rule, index) =>rule?
          <Card key={index} className={style.messageCard}>
        
                    
            <CardText style={{padding:0}}> 
            <table> 
            <tbody>
              <tr><td>
                <h3>{index+'#'} </h3>
              </td>
                <td> 
                <div style={{margin:'0px'}}>События: { Trigs(new TrigsStore(rule, index, {codeDialog: this.codeDialog, cronDialog: this.cronDialog})) }</div> 
                </td><td>
                <div style={{margin:'0px'}}>Действия: { Acts(new ActsStore(rule, index, {emailDialog: this.emailDialog, smsDialog: this.smsDialog})) } </div> 
                </td>
              </tr>
              </tbody>
            </table> <Button icon='clear' onClick={rulesStore.delRule.bind(rulesStore, devicesStore.selected,index)} floating  mini className={appStyle.floatRight} style={{marginTop:'-4%'}}  />
           
            </CardText>
          </Card>      
        :null)}
    </div>
  }
}
