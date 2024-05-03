import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import BaseFloatingDialog from "@utils/base-floating-dialog";

// define the properties of this component
ObservationDialog.propTypes = {
  obs_data: PropTypes.object
};

export default function ObservationDialog(obs_data) {
    // TODO: the url is put in here but it will eventually
    //  return a graph using data from this url
    const graphObj = (url) => {
        return (
            <Fragment>
                <div>
                    {url}
                </div>
            </Fragment>
        );
    };

    // create an object for the base dialog
    const floaterArgs = {title: obs_data.obs.station_name, description: obs_data.obs.location_name, openDialogImmediately:true, "dialogObject": {...graphObj(obs_data.obs.csvurl)}};

    // render the dialog.
    // the key here will be used to remove the dialog from the selected observation list when the dialog is closed
    return (
        <Fragment>
            <BaseFloatingDialog {...floaterArgs} />
        </Fragment>
    );
};