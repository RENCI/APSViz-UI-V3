import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import BaseFloatingDialog from "@utils/base-floating-dialog";
import {useLayers} from "@context";
import ObservationChart from "@utils/observation-chart";

// define the properties of this component
ObservationDialog.propTypes = {
  obs_data: PropTypes.object
};

export default function ObservationDialog(obs_data) {

    // get references to the observation data/list
    const {
        selectedObservations,
        setSelectedObservations
    } = useLayers();

    // create a graph using data from this url
    const graphObj = (url) => {
        const args = {dataUrl: url};

        return (
            <Fragment>
                <ObservationChart  {...args}/>
            </Fragment>
        );
    };

    // create an object for the base dialog
    const floaterArgs = {title: obs_data.obs.location_name, dialogObject: {...graphObj(obs_data.obs.csvurl)}, dataKey: obs_data.obs.station_name, dataList: selectedObservations, setDataList: setSelectedObservations};

    // render the dialog.
    // the key here will be used to remove the dialog from the selected observation list when the dialog is closed
    return (
        <Fragment>
            <BaseFloatingDialog {...floaterArgs} />
        </Fragment>
    );
};