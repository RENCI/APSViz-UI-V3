import React, { Fragment } from 'react';
import { Map } from '@components/map';
import { Sidebar } from '@components/sidebar';
import { ControlPanel } from '@components/control-panel';

export const App = () => {
  return (
    <Fragment>
      <Map/>
      <Sidebar />
      <ControlPanel/>
    </Fragment>
  );
};
