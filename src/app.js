import React, { Fragment } from 'react';
import { Map } from '@components/map';
import { ObservationDialog } from "@components/dialog/observation-dialog";
import { useLayers } from '@context';
import { Sidebar } from '@components/sidebar';
import { ControlPanel } from '@components/control-panel';
import { MapLegend } from '@components/legend';

export const App = () => {
    // install the selected observation list from the layer context
    const {
        selectedObservations
    } = useLayers();

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
