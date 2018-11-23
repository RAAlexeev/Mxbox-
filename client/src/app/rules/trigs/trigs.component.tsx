import * as React from 'react';
import {IconMenu, MenuItem, MenuDivider } from 'react-toolbox/lib/menu';
import * as style from './devices.css';
import Chip from 'react-toolbox/lib/chip';
import Avatar from 'react-toolbox/lib/avatar';
import{TrigsStore} from './trigs.store'
import Button from 'react-toolbox/lib/button';
import Tooltip from 'react-toolbox/lib/tooltip';
const TooltipButton = Tooltip(Button)
export const Trigs = ( trigStore:TrigsStore ) =>
   <div>
     
    
     { trigStore.trigs.map(( trig, index )=>         
      { if(trig)switch(trig.type) {
              case 0:return <Chip key={index} deletable onDeleteClick={trigStore.delTrig.bind(this,index)}>
                                <Avatar style={{backgroundColor: 'deepskyblue'}} icon='code'  />
                                <TooltipButton tooltip = 'Изменить' icon={trig.condition?'':'edit menu'} onClick={()=>trigStore.dialogs.codeDialog.handleToggle(trig, trigStore) }>
                                    {trig.condition?trig.condition.trim().slice(0,10):''}
                                </TooltipButton>
                            </Chip>
                           
              default:
                  break;
          }
        }
    )} 
   
    <IconMenu icon='add' position='topLeft' menuRipple>
        <MenuItem value='condition' icon='code' caption='Условие'  onClick={trigStore.addTrig.bind(this,{type:0})} />
        <MenuItem value='cron' icon='alarm' caption='Расписание' />
        <MenuItem value='in_sms' icon='sms' caption='sms' />
        <MenuItem value='in_email' icon='email' caption='Email' />
    </IconMenu>


</div>