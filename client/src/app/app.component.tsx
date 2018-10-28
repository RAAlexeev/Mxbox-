import * as React from 'react'
import { NavLink } from 'react-router-dom'
import * as style from './app.css'
import { Layout, NavDrawer, Panel, Sidebar } from 'react-toolbox/lib/layout';
import { AppBar } from 'react-toolbox/lib/app_bar';
import {Devices} from './devises/devices.component'

export class App extends React.Component<any, any> {

  renderDevTool() {
    if (process.env.NODE_ENV !== 'production') {
      const DevTools = require('mobx-react-devtools').default
      return (<DevTools />)
    }
  }
  state = {
    drawerActive: false,
    drawerPinned: false,
    sidebarPinned: false
};
toggleDrawerActive = () => {
  this.setState({ drawerActive: !this.state.drawerActive });
};

toggleDrawerPinned = () => {
  this.setState({ drawerPinned: !this.state.drawerPinned });
}

toggleSidebar = () => {
  this.setState({ sidebarPinned: !this.state.sidebarPinned });
};
  render() {
    return( 
    <Layout>
      <NavDrawer active={this.state.drawerActive}
                pinned={this.state.drawerPinned} permanentAt='xl'
                onOverlayClick={ this.toggleDrawerActive }>
          
            <NavLink to='/home' activeClassName={style.active}>Home</NavLink>
            <NavLink to='/posts' activeClassName={style.active}>Posts</NavLink>
            <Devices />
      </NavDrawer>
      <Panel>
        <AppBar leftIcon='menu' onLeftIconClick={ this.toggleDrawerActive } theme={style} />
              <div style={{ flex: 1, overflowY: 'auto', padding: '1.8rem' }}>
              <div className={style.container}>
                <h1>Shoutboard Application</h1>

                <div>
                  {this.props.children}
                  {this.renderDevTool()}
                </div>
                </div>
              </div>
        </Panel>

    </Layout>
    )};
}
