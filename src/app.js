import React, { Fragment, useRef } from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import { Map } from '@components/map';
import { ObservationDialog } from "@components/dialog/observation-dialog";
import { useLayers } from '@context';
import { Sidebar } from '@components/sidebar';
import { ControlPanel } from '@components/control-panel';
import { MapLegend } from '@components/legend';
import { Share } from '@share/share';
import { ScreenShot } from "@share/screenshot";
// TODO: For testing screenshot route ->
// import {TestScreenshot} from "@share/test-screenshot";

/**
 * renders the main content
 *
 * @returns {JSX.Element}
 * @constructor
 */
const Content = () => {
    // install the selected observation list from the layer context
    const {
        selectedObservations
    } = useLayers();

    // render all the application content
    return (
        <Fragment>
            {
                // for each observation selected
                selectedObservations.map (function (obs) {
                    // render the observation
                    return <ObservationDialog key={obs["station_name"]} obs={obs} />;
                })
            }
            <Map />
            <Sidebar />
            <ControlPanel/>
            <MapLegend />
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
    // create a reference
    const ref = useRef(null);

    // render the application
    return (
        <Fragment>
        <ScreenShot ref={ref}/>
        <div ref={ref}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={ <Content/> } />
                    <Route path="/share" element={ <Share/> } />
                    {/*<Route path="/testscreenshot" element={ <TestScreenshot/> } />*/}
                </Routes>
            </BrowserRouter>
        </div>
        </Fragment>
    );
};
