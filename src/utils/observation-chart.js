import React, {Fragment, useState, useEffect} from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
        return JSON.stringify(ret_val); // Returns JSON string
    }
}

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

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
            {/*{stationObs}*/}
            {/*<ResponsiveContainer width="100%" height="100%">*/}
            {/*    <LineChart*/}
            {/*        width={500}*/}
            {/*        height={300}*/}
            {/*        data={data}*/}
            {/*        margin={{*/}
            {/*            top: 5,*/}
            {/*            right: 30,*/}
            {/*            left: 20,*/}
            {/*            bottom: 5,*/}
            {/*        }}*/}
            {/*    >*/}
            {/*    </LineChart>*/}
            {/*</ResponsiveContainer>*/}
        </Fragment>
    );
};