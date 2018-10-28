import * as React from 'react'
import { inject, observer, Provider } from 'mobx-react'
import { observable, action } from 'mobx'
import { Card, CardMedia, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card'
import { NavLink } from 'react-router-dom'
import { Button } from 'react-toolbox/lib/button'
import { DevicesStore } from './devices.store'
import { AppStore } from '../app.store'
import * as style from './devices.css'
import * as appStyle from '../app.css'
import { ContextMenu } from './contextenu.componet';
@observer
export class Devices extends React.Component<any, any> {

  devicesStore: DevicesStore
  componentWillMount() {
    this.devicesStore = new DevicesStore()
    this.devicesStore.initializeDevices()
  }

  componentWillUnmount() {
   this.devicesStore.destructor()
  }

  render() {
    return <Provider devicesStore={this.devicesStore}>
      <DevicesComponent devicesStore={this.devicesStore} />
    </Provider>
  }
}

interface DevicesComponentProps {
  appStore?: AppStore,
  devicesStore?: DevicesStore
}

@inject('appStore')
@observer
export class DevicesComponent extends React.Component<DevicesComponentProps, any> {
  render() {
    const { devicesStore, appStore } = this.props
    return <div>

        <Button icon='add' onClick={devicesStore.addDevice.bind(devicesStore)} floating accent mini className={appStyle.floatRight} />
   
      <h3>Hello {appStore.username}</h3>
      {devicesStore.devices.map(device =>
             
        <Card  className={style.messageCard}>
         <NavLink key={device._id} to={'rules:'+device.name} activeClassName={style.active}>
          <CardTitle
            title={ContextMenu(device) }
            subtitle={'Адрес:'+device.mb_addr}
         />
          <CardText>{device.ip_addr}</CardText>
        </NavLink> 
        </Card>
        
        )}
    </div>
  }
}
