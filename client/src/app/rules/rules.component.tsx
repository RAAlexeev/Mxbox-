import * as React from 'react'
import { inject, observer, Provider } from 'mobx-react'
import { observable, action } from 'mobx'
import { Card, CardMedia, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card'
import { NavLink, Switch, Route, Redirect, } from 'react-router-dom'
import { Button } from 'react-toolbox/lib/button'
import { RulesStore } from './rules.store'
import { AppStore } from '../app.store'
import * as style from './devices.css'
import * as appStyle from '../app.css'
import { ContextMenu } from './contextenu.componet';
import { Input } from 'react-toolbox/lib/input'
import { DevicesStore } from '../devices/devices.store';
import { Trigs } from './trigs/trigs.component';




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
   render() {
    let i = 0 ;
   
    
    const { rulesStore, appStore, devicesStore } = this.props 
   
    const { name } = this.props.match.params
  
     return  !devicesStore.selected?<Redirect to='/home' />:<div>
       
        <Button icon='add' onClick={rulesStore.addRule.bind(rulesStore,devicesStore.selected)} floating accent mini className={appStyle.floatRight} />
        <h2>{'Правила для: '+ devicesStore.selected.name}</h2>
        {rulesStore.rules.map((rule,index) =>
       
        <Card key={index} className={style.messageCard} >
       
         
          <CardTitle className ={style.cardTitle}
            title={ '#' + index  }
            subtitle=''/>            
           
        <CardText> 
         <h3>Тригер:</h3> { Trigs(rulesStore,rule) } 
        </CardText>
         
        </Card>
        
        )}
    </div>
  }
}
