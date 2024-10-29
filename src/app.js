import React, { Fragment } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Map } from '@components/map';
import { ObservationDialog } from "@components/dialog/observation-dialog";
import { useLayers } from '@context';
import { Sidebar } from '@components/sidebar';
import { ControlPanel } from '@components/control-panel';
import { ComparePanel } from '@components/compare-panel';
import { MapLegend } from '@components/legend';
import { AlertUser } from '@components/alert-user';
import { Config } from '@components/config';

/**
 * renders the main content
 *
 * @returns React.ReactElement
 * @constructor
 */
const Content = () => {
    // install the selected observation list from the layer context
    const { selectedObservations, defaultInstanceName } = useLayers();

    // render all the application content
    return (
        <Fragment>
            {
                // for each observation selected
                selectedObservations.map (function (obs, idx) {
                    // add in an index used to cascade the dialogs
                    obs['index']=idx;

                    // render the observation draggable dialog
                    return <ObservationDialog key={obs["station_name"]} obs={obs} />;
                })
            }
            <Config />
            <AlertUser />
            <Sidebar />
            {/* here we are waiting for the retrieval of the default Instance name
                before rendering these components */}
            { (defaultInstanceName != null) && <Map/> }
            { (defaultInstanceName != null) && <ControlPanel/> }
            <ComparePanel/>
            <MapLegend />
        </Fragment>
    );
};

/**
 * renders the application
 *
 * @returns React.ReactElement
 * @constructor
 */
export const App = () => {
    // render the application
    return (
        <Fragment>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={ <Content/> } />
               </Routes>
            </BrowserRouter>
        </Fragment>
    );
};
