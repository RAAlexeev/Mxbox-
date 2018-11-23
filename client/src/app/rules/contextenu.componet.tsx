import * as React from 'react';
import { IconMenu, MenuItem, MenuDivider } from 'react-toolbox/lib/menu';
import * as style from './rules.css';

import { TemplatesStore } from './templates.store';
import { RulesStore } from './rules.store';
import Tooltip from 'react-toolbox/lib/tooltip';
const TooltipMIconMenu = Tooltip(IconMenu)
export const TemplateMenu = (templatesStore:TemplatesStore,devicesStore,rulesStore:RulesStore)=> <div>     
  <TooltipMIconMenu tooltipDelay={500} tooltip='Шаблоны...' className={style.iconMenu}  icon='save_alt' position='topRight' menuRipple>
    <MenuItem disabled={!(rulesStore.rules.length > 0)}  value='add' icon='save' caption='как шаблон' onClick={templatesStore.addAsTemplate.bind(templatesStore,devicesStore.selected)} />
    <MenuDivider />
    {templatesStore.templates.map((template,index)=> 
        <MenuItem  key={index} value={'template'+index} icon='get_app' caption={template.name} onClick={rulesStore.addFromTemplate.bind(rulesStore,devicesStore.selected,template)} />
    )} 
  </TooltipMIconMenu>
 </div>

 
