import * as React from 'react'
import * as ReactDOM from 'react-dom'
import "es6-promise/auto"
import { useStrict } from 'mobx'
import { Provider } from 'mobx-react'

import { Router, Route, Redirect, Switch } from 'react-router'


import { App } from './app.component'
import { AppStore } from './app.store'
import { RouterStore } from './router.store'

import { Form } from './form/form.component'
import { Home } from './home/home.component'

import { DevRules } from './rules/rules.component';
import { DevicesStore } from './devices/devices.store';


const appStore = AppStore.getInstance()
const routerStore = RouterStore.getInstance()
const devicesStore =  DevicesStore.getInstance()
const rootStores = {
  appStore,
  routerStore,
  devicesStore
}

ReactDOM.render(
   <Provider {...rootStores} >
      <Router history={routerStore.history} >
      <App>
        <Switch >
          <Route exact path='/home' component={Home as any} />
          <Route exact  path={"/rules/:name/:id"} component={DevRules as any} />
          <Route exact path='/form' component={Form as any} />
          <Redirect from='/' to='/home' />
        </Switch>
      </App>
    </Router>
  </Provider >

,  document.getElementById('root')
)
