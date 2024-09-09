import * as hurricanes from './hurricane';
import * as layers from './layers';
import * as compare_layers from './compare-layers';
import * as model_selection from './model-selection';
import * as remove_items from './remove';
import * as settings from './settings';
import * as share_view from './share';
import * as help_about from './help-about';
//import * as screen_shot from './screenshot';

export default {
  layers,
  compare_layers,
  hurricanes,
  model_selection,
  remove_items,
  settings,
  share_view,
  help_about,
};

/*
  a new menu/tray item, must have these named exports:
  
  - `title`, String; this will occupy the menu item's
     tooltip and the header of the tray.
  - `icon`, ReactNode; this lands inside an MUI Joy IconButton component.
     we already use the Material Icons icon library, so start there:
     https://mui.com/material-ui/material-icons/
  - `trayContents`, ReactNode; the contents of the new tray
  
  for example, this boilerplate should be sufficient starting place:
  
     export const icon = <MyIcon />
     export const title = 'My New Tray'
     export const trayContents = () => <div>my tray contents!</div>
  
  
  the final step is to export it from this file, by importing it
  and adding it to the default export object. 
*/
