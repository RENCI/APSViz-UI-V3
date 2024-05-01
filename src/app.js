import { Fragment } from 'react'
import { Map } from '@components/map'
import { Sidebar } from '@components/sidebar'

export const App = () => {
  return (
    <Fragment>
      <Map/>
      <Sidebar />
    </Fragment>
  );
};
