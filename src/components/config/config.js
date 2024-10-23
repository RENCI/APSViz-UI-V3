import React, { Fragment, useEffect } from "react";
import { useLayers } from "@context";

export const Config = () => {
    // get the message alert details from state
    const { setDefaultInstanceName } = useLayers();

    useEffect (() => {
        // get the instance name from UI data services
        const instance_name = getDefaultInstanceName();

        // if the retrieval successful
        if (!instance_name.includes('Error')) {}
            // set the default instance name
            setDefaultInstanceName(instance_name);
        }, []
    );

    const getDefaultInstanceName = () => {
        return 'ec95d_dev_test';
    };

    return(
        <Fragment></Fragment>
    );
};