import React, { Fragment } from 'react';
import { Map } from '@components/map';
import FloatingDialog from '@utils/dialog-utils';
// import SubObj from "@utils/subObj";

export const App = () => {
  return (
    <Fragment>
        <FloatingDialog title={"A title"} dialogText={"the dialog text"} openDialog={true}/>
        <Map />
     </Fragment>
  );
};
