import React, { Fragment } from 'react';
import { Map } from '@components/map';
import BaseFloatingDialog from "@utils/dialog-utils";

export const App = () => {
    const subObj = () => {
        return (
            <Fragment>
                <div>
                    <br/>
                    This is a dialog sub-component.
                    <br/>
                </div>
            </Fragment>
        );
    };

    const floaterArgs = {title: "The dialog title.", description: "The dialog description.", openDialogImmediately:true, "dialogObject": {...subObj()}};

    return (
    <Fragment>
        <BaseFloatingDialog {...floaterArgs} />
        <Map />
     </Fragment>
    );
};
