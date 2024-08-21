import React, { Fragment } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Map } from '@components/map';
import { ObservationDialog } from "@components/dialog/observation-dialog";
import { useLayers } from '@context';
import { Sidebar } from '@components/sidebar';
import { ControlPanel } from '@components/control-panel';

/**
 * renders the main content
 *
 * @returns {JSX.Element}
 * @constructor
 */
const Content = () => {
    // install the selected observation list from the layer context
    const { selectedObservations } = useLayers();

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
            <Map />
            <Sidebar />
            <ControlPanel/>
        </Fragment>
    );
};

/**
 * renders the application
 *
 * @returns {JSX.Element}
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
