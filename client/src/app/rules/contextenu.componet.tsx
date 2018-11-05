import * as React from 'react';
import {IconMenu, MenuItem, MenuDivider } from 'react-toolbox/lib/menu';
import * as style from './devices.css';
import { Input } from 'react-toolbox/lib/input'

export const ContextMenu = (devicesStore,device) =><div>     
  <IconMenu  theme={style}  icon='more_vert' position='topLeft' menuRipple>
    <MenuItem value='download' icon='get_app' caption='Download' />
    <MenuItem value='help' icon='favorite' caption='Favorite' />
    <MenuItem value='settings' icon='open_in_browser' caption='Open in app' />
    <MenuDivider />
   
    <MenuItem  onClick={devicesStore.delDevice.bind(devicesStore,device)} value='delete' icon='delete' caption='Delete'  />
   </IconMenu>
    <Input theme={style}
        type='text'
        name='mame'
        //error={devicesStore.title.error}
        value={device.name}
        maxLength={25}        
        onChange={devicesStore.nameOnChange.bind(this, device, devicesStore)}
      />

 </div>