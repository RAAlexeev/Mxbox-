import * as React from 'react';
import {IconMenu, MenuItem, MenuDivider } from 'react-toolbox/lib/menu';
import * as style from './devices.css';
import { Input } from 'react-toolbox/lib/input'


export const ContextMenu = (devicesStore,device) =>
<span>
  <IconMenu  theme={style}  icon='more_vert' position='topLeft' menuRipple>
    <MenuItem onClick={()=>(devicesStore.isEdit = true)} value='edit' icon='edit' caption='Изменить' />
   <MenuDivider />
   
    <MenuItem  onClick={devicesStore.delDevice.bind(devicesStore, device)} value='delete' icon='delete' caption='Удалить'  />
   </IconMenu>

    <Input className={style.name}
        type='text'
        name='ame'
        disabled = {!(devicesStore.isEdit && devicesStore.selected === device)}
        error={device.error?device.error:''}
        value={device.name}
        maxLength={25}        
        onChange={devicesStore.nameOnChange.bind(this, device, devicesStore)}
      />
</span>
