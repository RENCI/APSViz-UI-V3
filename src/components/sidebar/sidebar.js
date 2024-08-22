import React from 'react';
import { Fragment, useCallback, useState } from 'react';
import { Box, List, Sheet, useTheme } from '@mui/joy';
import { Tray } from './tray';
import { MenuItem } from './menu-item';
import SidebarTrays from '../trays';

// ordered list of tray keys for lower portion of sidebar
// tray for unlisted keys will be stuck into upper sidebar list.
const LOWER_SIDEBAR_MENU_ITEM_IDS = [
  'help_about',
  'settings',
];
// split sidebar items into upper and lower
const sidebarMenuItemKeys = Object.keys(SidebarTrays)
  .reduce((acc, trayKey) => {
    const upperOrLower = LOWER_SIDEBAR_MENU_ITEM_IDS.includes(trayKey) ? 'lower' : 'upper';
    acc[upperOrLower].push(trayKey);
    return acc;
  }, { upper: [], lower: [] });
// align order with that of LOWER_SIDEBAR_MENU_ITEM_IDS
sidebarMenuItemKeys.lower.sort((a, b) => 
  LOWER_SIDEBAR_MENU_ITEM_IDS.indexOf(a) - LOWER_SIDEBAR_MENU_ITEM_IDS.indexOf(b)
);

export const Sidebar = () => {
  const theme = useTheme();
  const [activeKey, setActiveKey] = useState(null);

  const handleClickMenuItem = useCallback(newKey => {
    // if the incoming new index equals the old index,
    // then the user wants to close the currently open tray.
    if (newKey === activeKey) {
      setActiveKey(null);
      return;
    }
    // otherwise, open desired tray.
    setActiveKey(newKey);
  }, [activeKey]);

  return (
    <Fragment>
      <Sheet
        variant="soft"
        sx={{
          position: 'absolute',
          top: 0, left: 0,
          height: '100vh',
          zIndex: 420,
          maxWidth: '68px',
          overflow: 'hidden',
          p: 0,
          backgroundColor: activeKey === -1
            ? `rgba(${ theme.palette.mainChannel } / 0.2)`
            : `rgba(${ theme.palette.mainChannel } / 1.0)`,
          // a drop shadow looks nice. we'll remove it if a tray is open,
          // as they should appear on the same plane.
          filter: activeKey === -1 ? 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.2))' : 'drop-shadow(1px 0 0 rgba(0, 0, 0, 0.2))',
          // similarly, here.
          '&:hover': {
            backgroundColor: `rgba(${ theme.palette.mainChannel } / 1.0)`,
            transition: 'max-width 250ms, filter 250ms, background-color 150ms',
          },
          // we'll add a delay to this exit animation to give ample time
          // for the disappearing tray get out of they view before going translucent.
          // otherwise we see it sliding behind the sidebar
          // this is also nice for accidental mouse leaves. we'll also fade slower than we un-fade.
          transition: 'max-width 250ms, filter 250ms, background-color 1000ms 500ms',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <List>
            {
              sidebarMenuItemKeys.upper
                .map((key) => {
                  return (
                    <MenuItem
                      key={ `menu-item-${ key }` }
                      active={ key === activeKey }
                      title={ SidebarTrays[key].title }
                      Icon={ SidebarTrays[key].icon }
                      onClick={ () => handleClickMenuItem(key) }
                    />
                  );
                })
            }
            <Box sx={{ flex: 1 }} /> {/**/}
            {
              sidebarMenuItemKeys.lower
                .map((key) => {
                  return (
                    <MenuItem
                      key={ `menu-item-${ key }` }
                      active={ key === activeKey }
                      title={ SidebarTrays[key].title }
                      Icon={ SidebarTrays[key].icon }
                      onClick={ () => handleClickMenuItem(key) }
                    />
                  );
                })
            }
        </List>
        
      </Sheet>
      {
        Object.keys(SidebarTrays).map((key) => {
          return (
            <Tray
              key={ `tray-${ key }` }
              active={ activeKey === key }
              title={ SidebarTrays[key].title }
              Contents={ SidebarTrays[key].trayContents }
              closeHandler={ () => setActiveKey(-1) }
            />
          );
        })
      }
    </Fragment>
  );
};
