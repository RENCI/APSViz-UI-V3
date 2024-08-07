import React, { useState, Fragment } from 'react';
import BaseFloatingDialog from "@dialog/base-floating-dialog";
import { useLayers } from "@context";
import ObservationChart from "@dialog/observation-chart";

/**
 * This component renders the observation dialog, including the chart
 *
 * @param obs_data
 * @returns {JSX.Element}
 * @constructor
 */
export const ObservationDialog = (obs_data) => {
    // get references to the observation data/list
    const {
        map,
        selectedObservations,
        setSelectedObservations
    } = useLayers();

    // create state for the showing of the chart lines
    const [isHideLine, setIsHideLine] = useState({
        "Observations": false,
        "NOAA Tidal Predictions": false,
        "APS Nowcast": false,
        "APS Forecast": false,
        "Difference (APS-OBS)": false });

    // method to toggle the  line view polarity
    const toggleLineView = (item) => {
        isHideLine[item] = !isHideLine[item];
        setIsHideLine({ ...isHideLine });
    };

    // create state for the showing of the chart line view button
    const [showLineButton, setShowLineButton] = useState({
        "Observations": false,
        "NOAA Tidal Predictions": false,
        "APS Nowcast": false,
        "APS Forecast": false,
        "Difference (APS-OBS)": false });

    const setLineButtonView = (item) => {
        // if the line view button should be in view
        if (!showLineButton[item]) {
            showLineButton[item] = true;
            setShowLineButton({...showLineButton});
        }
    };

    const showLineButtonView = (item) => {
        // gets the current button line view state
        return showLineButton[item];
    };

    // create a graph using data from this url
    const graphObj = (url) => {
        // create the chart
        return (
            <Fragment>
                <ObservationChart url={ url } isHideLine={ isHideLine } setLineButtonView={ setLineButtonView } />
            </Fragment>
        );
    };

    // create a data object for the base dialog to use to render
    const floaterArgs = {
        title: obs_data.obs['location_name'],
        index: obs_data.obs['index'],
        dialogObject: { ...graphObj(obs_data.obs['csvurl']) },
        dataKey: obs_data.obs['id'],
        dataList: selectedObservations,
        setDataList: setSelectedObservations,
        map: map,
        showLineButtonView: showLineButtonView,
        toggleLineView: toggleLineView
    };

    // render the dialog
    return (
        <Fragment>
            <BaseFloatingDialog { ...floaterArgs } />
        </Fragment>
    );
};