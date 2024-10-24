import React, { Fragment } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Typography } from '@mui/material';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, ReferenceLine } from 'recharts';

import dayjs from 'dayjs';

// install day.js for UTC visual formatting
const utc = require("dayjs/plugin/utc");

// init the date formatter to use UTC only
dayjs.extend(utc);

/**
 * renders the observations as a chart
 *
 * @param dataUrl
 * @returns JSX.Element
 * @constructor
 */
export default function ObservationChart(chartProps) {
    // render the chart
    return (<CreateObsChart chartProps={ chartProps } />);
}

/**
 * this suppresses the re-chart errors on the x/y-axis rendering.
 *
 * @type {{(message?: any, ...optionalParams: any[]): void, (...data: any[]): void}}
 */
const error = console.error;
console.error = (...args) => {
  if (/defaultProps/.test(args[0])) return;
  error(...args);
};

/**
 * Retrieves and returns the chart data in json format
 *
 * @param url
 * @returns { json }
 */
function getObsChartData(url, setLineButtonView) {

    // configure the retry count to be zero
    axiosRetry(axios, {
       retries: 0
    });

    // return the data to the caller
    return useQuery( {
        // specify the data key and url to use
        queryKey: ['apsviz-data', url],

        // create the function to call for data
        queryFn: async () => {
            // make the call to get the data
            const ret_val = await axios
                // make the call to get the data
                .get(url)
                // use the data returned
                .then (( response ) => {
                    // return the data
                    return response.data;
                })
                // otherwise post the issue to the console log
                .catch (( error ) => {
                    // make sure we do not render anything
                    return error.response.status;
                });

            // if there was not an error
            if (ret_val !== 500) {
                // return the csv data in json format
                return csvToJSON(ret_val, setLineButtonView);
            }
            else
                // just return nothing and nothing will be rendered
                return '';
        }, refetchOnWindowFocus: false
    });
}

/**
 * converts CSV data into json format
 *
 * @param csvData
 * @returns { json [] }
 */
function csvToJSON(csvData, setLineButtonView) {
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
            // only convert records with a valid time
            if (e.time !== "") {
                // take off the time zone
                e.time = e.time.substring(0, e.time.split(':', 2).join(':').length) + 'Z';

                // data that is missing a value will not result in plotting
                if (e["Observations"]) {
                    e["Observations"] = +parseFloat(e["Observations"]).toFixed(3);

                    // set the line button to be in view
                    setLineButtonView("Observations");
                }
                else
                    e["Observations"] = null;

                if (e["NOAA Tidal Predictions"]) {
                    e["NOAA Tidal Predictions"] = +parseFloat(e["NOAA Tidal Predictions"]).toFixed(3);

                    // set the line button to be in view
                    setLineButtonView("NOAA Tidal Predictions");
                }
                else
                    e["NOAA Tidal Predictions"] = null;

                if (e["APS Nowcast"]) {
                    e["APS Nowcast"] = +parseFloat(e["APS Nowcast"]).toFixed(3);

                    // set the line button to be in view
                    setLineButtonView("APS Nowcast");
                }
                else
                    e["APS Nowcast"] = null;

                if (e["APS Forecast"]) {
                    e["APS Forecast"] = +parseFloat(e["APS Forecast"]).toFixed(3);

                    // set the line button to be in view
                    setLineButtonView("APS Forecast");
                }
                else
                    e["APS Forecast"] = null;

                if (e["SWAN Nowcast"]) {
                    e["SWAN Nowcast"] = +parseFloat(e["SWAN Nowcast"]).toFixed(3);

                    // set the line button to be in view
                    setLineButtonView("SWAN Nowcast");
                }
                else
                    e["SWAN Nowcast"] = null;

                if (e["SWAN Forecast"]) {
                    e["SWAN Forecast"] = +parseFloat(e["SWAN Forecast"]).toFixed(3);

                    // set the line button to be in view
                    setLineButtonView("SWAN Forecast");
                }
                else
                    e["SWAN Forecast"] = null;

                if (e["Difference (APS-OBS)"]) {
                    e["Difference (APS-OBS)"] = +parseFloat(e["Difference (APS-OBS)"]).toFixed(3);

                    // set the line button to be in view
                    setLineButtonView("Difference (APS-OBS)");
                }
                else
                    e["Difference (APS-OBS)"] = null;
            }
        });

        // return the json data representation
        return ret_val;
    }
}

/**
 * reformats the data label shown on the x-axis
 *
 * @param value
 * @returns {string}
 */
function formatY_axis(value) {
    // return the formatted value
    return value.toFixed(2);
}

/**
 * reformats the data label shown on the x-axis
 *
 * @param value
 * @returns {string}
 */
function formatX_axis(value) {
    // init the return value
    let ret_val = "";

    // empty data will be ignored
    if (value !== "")
        // do the reformatting
        ret_val = dayjs.utc(value).format('MM/DD-HH').split('+')[0] + 'Z';

    // return the formatted value
    return ret_val;
}

/**
 * gets the max value in the data to set the y-axis range and ticks
 *
 * @param data
 * @returns {null|*[]}
 */
function get_yaxis_ticks(data) {
    // insure there is something to work with
    if (data !== undefined && data.length > 0) {
        // init the max value found
        let maxVal = 0;

        // get the keys of the first
        const theKeys = Object.keys(data[0]);

        // remove time from the array
        theKeys.shift();

        // get the max value in the data for each key
        theKeys.forEach((aKey) => {
            // identify the max value in the array of values
            const newVal = Math.max(...data
                // make sure we do not run into any null or undefined values in the data
                .filter(function(o) { return !(o[aKey] === undefined || o[aKey] === null); })
                // create the array of all the values
                .map(o => o[aKey]));

            // if there was a new max value found
            if (newVal > maxVal) {
                // save the new max value
                maxVal = newVal;
            }
        });

        // round up to the next integer
        maxVal = Math.ceil(maxVal);

        // init the return value
        const ret_val = [];

        // create an array of tick marks based on the mav data value
        for (let i=-maxVal; i <= maxVal; i += .5)
            ret_val.push(i);

        // return the new y-axis array range
        return ret_val;
    }
}

/**
 * Creates the chart.
 *
 * @param url
 * @returns JSX.Element
 * @constructor
 */
function CreateObsChart(c) {
    // call to get the data. expect back some information too
    const { status, data } = getObsChartData(c.chartProps.url, c.chartProps.setLineButtonView);

    // render the chart
    return (
        <Fragment>
        {
            status === 'pending' ? ( <Typography sx={{ alignItems: 'center', fontSize: 12 }}>Gathering chart data...</Typography> ) :
                (status === 'error' || data === '') ? ( <Typography sx={{ alignItems: 'center', color: 'red', fontSize: 12 }}>There was a problem collecting data for this location.</Typography> ) :
                <ResponsiveContainer>
                    <LineChart data={ data } margin={{ left: -25 }} isHide={ c.chartProps.isHideLine }>
                        <CartesianGrid strokeDasharray="1 1" />

                        <XAxis tick={{ stroke: 'tan', strokeWidth: .5 }} tickSize="10" dataKey="time" tickFormatter={ (value) => formatX_axis(value) }/>

                        <ReferenceLine y={0} stroke="Black" strokeDasharray="3 3" />
                        <YAxis ticks={ get_yaxis_ticks(data) } tick={{ stroke: 'tan', strokeWidth: .5 }} tickFormatter={ (value) => formatY_axis(value) } />

                        <Tooltip />

                        <Line type="monotone" dataKey="Observations" stroke="black" strokeWidth={1} dot={false} isAnimationActive={false} hide={ c.chartProps.isHideLine['Observations'] }/>
                        <Line type="monotone" dataKey="NOAA Tidal Predictions" stroke="teal" strokeWidth={1} dot={false} isAnimationActive={false} hide={ c.chartProps.isHideLine["NOAA Tidal Predictions"] }/>
                        <Line type="monotone" dataKey="APS Nowcast" stroke="CornflowerBlue" strokeWidth={2} dot={false} isAnimationActive={false} hide={ c.chartProps.isHideLine["APS Nowcast"] }/>
                        <Line type="monotone" dataKey="APS Forecast" stroke="LimeGreen" strokeWidth={2} dot={false} isAnimationActive={false} hide={ c.chartProps.isHideLine["APS Forecast"] }/>
                        <Line type="monotone" dataKey="SWAN Nowcast" stroke="CornflowerBlue" strokeWidth={2} dot={false} isAnimationActive={false} hide={ c.chartProps.isHideLine["SWAN Nowcast"] }/>
                        <Line type="monotone" dataKey="SWAN Forecast" stroke="LimeGreen" strokeWidth={2} dot={false} isAnimationActive={false} hide={ c.chartProps.isHideLine["SWAN Forecast"] }/>
                        <Line type="monotone" dataKey="Difference (APS-OBS)" stroke="red" strokeWidth={1} dot={false} isAnimationActive={false} hide={ c.chartProps.isHideLine["Difference (APS-OBS)"] } />
                    </LineChart>
                </ResponsiveContainer>
        }
        </Fragment>
    );
}
