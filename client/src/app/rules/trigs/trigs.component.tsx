import * as React from 'react';
import {IconMenu, MenuItem, MenuDivider } from 'react-toolbox/lib/menu';
import * as style from './devices.css';
import Chip from 'react-toolbox/lib/chip';
import Avatar from 'react-toolbox/lib/avatar';
import { RulesStore, Rule } from '../rules.store';


export const Trigs = ( rulesStore:RulesStore, rule:Rule ) =>
   <div>

     { rule.trigs.map(trig=>         
      { switch(trig.type) {
              case 0:return <Chip deletable>
                                <Avatar style={{backgroundColor: 'deepskyblue'}} icon="code" />
                            </Chip>
                           
              default:
                  break;
          }
        }
    )} 
   
    <IconMenu icon='add' position='topLeft' menuRipple>
        <MenuItem value='condition' icon='code' caption='Условие' /* onClick={this.rulesStore.addTrig.bind()} *//>
        <MenuItem value='cron' icon='alarm' caption='Расписание' />
        <MenuItem value='in_sms' icon='sms' caption='sms' />
        <MenuItem value='in_email' icon='email' caption='Email' />
    </IconMenu>


</div>