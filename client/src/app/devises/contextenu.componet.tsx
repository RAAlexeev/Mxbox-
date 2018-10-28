import * as React from 'react'
import {IconMenu, MenuItem, MenuDivider } from 'react-toolbox/lib/menu';
import * as style from './devices.css'
export const ContextMenu = (device) =><div>     
  <IconMenu  theme={style}  icon='more_vert' position='topLeft' menuRipple>
    <MenuItem value='download' icon='get_app' caption='Download' />
    <MenuItem value='help' icon='favorite' caption='Favorite' />
    <MenuItem value='settings' icon='open_in_browser' caption='Open in app' />
    <MenuDivider />
    <MenuItem value='signout' icon='delete' caption='Delete'  />
   </IconMenu>
   {device.name}
 </div>