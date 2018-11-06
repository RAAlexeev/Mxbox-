import * as React from 'react'
import { inject, observer, Provider } from 'mobx-react'
import { observable, action } from 'mobx'
import { Card, CardMedia, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card'
import { NavLink, Switch, Route, } from 'react-router-dom'
import { Button } from 'react-toolbox/lib/button'
import { RulesStore } from './rules.store'
import { AppStore } from '../app.store'
import * as style from './devices.css'
import * as appStyle from '../app.css'
import { ContextMenu } from './contextenu.componet';
import { Input } from 'react-toolbox/lib/input'


@observer
export class DevRules extends React.Component<any, any> {

  rulesStore: RulesStore
  componentWillMount() {
    this.rulesStore = new RulesStore()
    console.log(this.props);
    
 
    //this.rulesStore.initializeRules(this.props.match)
  }

  componentWillUnmount() {
     this.rulesStore.destructor()
  }

  render() {  this.rulesStore = new RulesStore()
    this.rulesStore.initializeRules(this.props.match)
   
    return <Provider rulesStore={this.rulesStore}>
 
    <RulesComponent {...this.props} />
    </Provider>
  }
   
}

interface RulesComponentProps {
  appStore?: AppStore,
  rulesStore?: RulesStore,
  match?:any
}

@inject('appStore','rulesStore')
@observer
export class RulesComponent extends React.Component<RulesComponentProps, any> { 
   render() {
    let i = 0 ;
    const { rulesStore, appStore } = this.props 
    const { name } = this.props.match.params
    return <div>
        <Button icon='add' onClick={rulesStore.addRule.bind(rulesStore)} floating accent mini className={appStyle.floatRight} />
        {name}
        {rulesStore.rules.map(rule =>
       
        <Card key={i++} className={style.messageCard} >
       
         
          <CardTitle className ={style.cardTitle}
            title={ i+rule.name}
            subtitle='не связи'/>            
           
        <CardText> </CardText>
         
        </Card>
        
        )}
    </div>
  }
}
