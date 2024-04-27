import { Fragment } from 'react'
import { Map } from '@components/map'
import { Drawer } from '@components/drawer'

export const App = () => {
  return (
    <Fragment>
      <Map/>
      <Drawer />
    </Fragment>
  )
}
