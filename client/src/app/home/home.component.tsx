import * as React from 'react'
import { inject, observer, Provider } from 'mobx-react'
import { Input } from 'react-toolbox/lib/input'
import { HomeStore } from './home.store'
import { AppStore } from '../app.store'
import { DevicesStore } from '../devices/devices.store';

@observer
export class Home extends React.Component<any, any> {

  homeStore: HomeStore
  componentWillMount() {
    this.homeStore = new HomeStore()
  }

  render() {
    return <Provider homeStore={this.homeStore}>
      <HomeComponent />
    </Provider>
  }
}

interface HomeComponentProps {
  appStore?: AppStore,
  homeStore?: HomeStore
}

@inject('appStore', 'homeStore')
@observer
export class HomeComponent extends React.Component<HomeComponentProps, any> {
  render() {
    {DevicesStore.getInstance().select(null)}
    const { homeStore, appStore } = this.props
    return <div>
      <h2>Конфигуратор системы оповещения и мониторинга</h2>
      <p>Позволяет конфигурировать серверную часть системы, создавая правила для устройств, подключеннных к MxBox© и определяя в них события и действия соответствующие событиям.
        <br/>Для это добавьте устройство в левой панели и выберете его, задайте наименование и адрес modbus в поле Адрес, затем в правой добавляйте правила, в них события и соответствующие действия.</p>
        <p>По всем вопросам и предложениям пишите: <a href="mailto:alekseev@mx-omsk.ru">alekseev@mx-omsk.ru</a></p>
      <Input
        type='text'
        label=''
        name='username'
        value={appStore.username}
        onChange={appStore.onUsernameChange}
      />
  
   
    </div>
  }
}
