import React, {Fragment, useState, useEffect} from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

import PropTypes from 'prop-types';

// define the properties of this component
ObservationChart.propTypes = {
  dataUrl: PropTypes.string
};

/**
 * converts CSV data to json format
 *
 * @param csvData
 * @returns {string}
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

        // TODO: return the data as a json string (for now)
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

        fetchData().then();
    }, [dataUrl]);

    // render the chart.
    return (
        <Fragment>
        <LineChart
          width={500}
          height={300}
          data={stationObs}
          margin={{
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis type="number" domain={['auto', 'auto']} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Observations" stroke="#8884d8" strokeWidth={2} dot={false} isAnimationActive={false} />
          <Line type="monotone" dataKey="NOAA Tidal Predictions" stroke="#82ca9d" strokeWidth={2} dot={false} isAnimationActive={false} />
        </LineChart></Fragment>
    );
};