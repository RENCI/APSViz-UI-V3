import React, { Fragment } from 'react';
import { Map } from '@components/map';
import BaseFloatingDialog from "@utils/dialog-utils";
// import SubObj from "@utils/subObj";

export const App = () => {
  return (
    <Fragment>
        <BaseFloatingDialog title={"A title"} dialogText={"the dialog text"} openDialogImmediately={true}/>
        <Map />
     </Fragment>
  );
};
