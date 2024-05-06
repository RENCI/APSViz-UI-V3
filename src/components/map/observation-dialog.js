import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import BaseFloatingDialog from "@utils/base-floating-dialog";
import {useLayers} from "@context";
import ObservationChart from "@utils/observation-chart";

// define the properties of this component
ObservationDialog.propTypes = {
  obs_data: PropTypes.object
};

/**
 * This component renders the observation dialog, including the chart
 *
 * @param obs_data
 * @returns {JSX.Element}
 * @constructor
 */
export default function ObservationDialog(obs_data) {
    // get references to the observation data/list
    const {
        selectedObservations,
        setSelectedObservations
    } = useLayers();

    // create a graph using data from this url
    const graphObj = (url) => {
        // create the data object
        const args = { dataUrl: url };

        // create the chart
        return (
            <Fragment>
                <ObservationChart { ...args } />
            </Fragment>
        );
    };

    // create an object for the base dialog arguments
    const floaterArgs = {title: obs_data.obs.location_name, dialogObject: {...graphObj(obs_data.obs.csvurl)}, dataKey: obs_data.obs.station_name, dataList: selectedObservations, setDataList: setSelectedObservations};

    // render the dialog
    return (
        <Fragment>
            <BaseFloatingDialog {...floaterArgs} />
        </Fragment>
    );
};