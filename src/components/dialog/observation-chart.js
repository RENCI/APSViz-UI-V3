import React, {Fragment, useState, useEffect} from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

import PropTypes from 'prop-types';

// define the properties of this component
ObservationChart.propTypes = {
  dataUrl: PropTypes.string
};

/**
 * converts CSV data into json format
 *
 * @param csvData
 * @returns {*[]}
 */
function csvToJSON(csvData) {
    // ensure that there is csv data to convert
    if (csvData !== "") {
        // split on carriage returns
        const lines = csvData.split("\n");

        // init the result
        const ret_val = [];

        // get the first line (data header)
        const dataHeader = lines[0].split(",");

        // loop through the rest of the data
        for (let i = 1; i < lines.length; i++) {
            // split the line on commas
            const currentLine = lines[i].split(",");

            // init the converted data
            const jsonObj = {};

            // loop through the data and get name/vale pairs in json format
            for (let j = 0; j < dataHeader.length; j++) {
                // save the data
                jsonObj[dataHeader[j]] = currentLine[j];
            }

            // add the data to the return
            ret_val.push(jsonObj);
        }

        // remove the timezone from the time value
        ret_val.map(function (e){
            e.time = e.time.substring(0, e.time.split(':', 2).join(':').length);
            if (e["APS Nowcast"]) e["APS Nowcast"] = +parseFloat(e["APS Nowcast"]).toFixed(4);
            if (e["Observations"]) e["Observations"] = +parseFloat(e["Observations"]).toFixed(4);
            if (e["NOAA Tidal Predictions"]) e["NOAA Tidal Predictions"] = +parseFloat(e["NOAA Tidal Predictions"]).toFixed(3);
            if (e["Difference (APS-OBS)"]) e["Difference (APS-OBS)"] = +parseFloat(e["Difference (APS-OBS)"]).toFixed(3);
        });

        // return the json data representation
        return ret_val;
    }
}

/**
 * renders the observations as a chart
 *
 * @param dataUrl
 * @returns {JSX.Element}
 * @constructor
 */
export default function ObservationChart(dataUrl) {
    // store the station observation data in state
    const [stationObs, setStationObs] = useState("");

    // get the data
    useEffect( () => {
        const fetchData = () => {
            return fetch(dataUrl.dataUrl)
                .then(res => {
                    return res.text();
                })
                .then(data => {
                    setStationObs(csvToJSON(data));
                    // console.log(JSON.stringify(data));
                })
                .catch(err => {
                    console.log(err);
                });
        };

        // finish off the data retrieval
        fetchData().then();
    }, [dataUrl]);

    // render the chart.
    return (
        <Fragment>
            <LineChart width={590} height={300} data={stationObs} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={['dataMin', 'dataMax']} />
                <Tooltip />
                <Legend verticalAlign="bottom" height={30} />
                <Line type="monotone" dataKey="Observations" stroke="gray" strokeWidth={2} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="NOAA Tidal Predictions" stroke="teal" strokeWidth={2} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="APS Nowcast" stroke="CornflowerBlue" strokeWidth={2} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="Difference (APS-OBS)" stroke="red" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
        </Fragment>
    );
};
