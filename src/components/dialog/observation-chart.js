import React from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Tooltip, ReferenceLine } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { useSettings } from "@context";
import dayjs from 'dayjs';

// install day.js for UTC visual formatting
const utc = require("dayjs/plugin/utc");

// init the date formatter to use UTC only
dayjs.extend(utc);

/**
 * renders the observations as a chart
 *
 * @param dataUrl
 * @returns {JSX.Element}
 * @constructor
 */
export default function ObservationChart(url) {
    // render the chart
    return (<CreateObsChart url={ url.url } />);
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
function getObsChartData(url) {
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
                    // send the error message to the console
                    console.error(error.message);

                    // make sure we dont render anything
                    return "";
                });

            // return the csv data in json format
            return csvToJSON(ret_val);
        }
    });
}

/**
 * converts CSV data into json format
 *
 * @param csvData
 * @returns { json [] }
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
            // only convert records with a valid time
            if (e.time !== "") {
                // take off the time zone
                e.time = e.time.substring(0, e.time.split(':', 2).join(':').length) + 'Z';

                // data that is missing a value will not result in plotting
                if (e["APS Nowcast"])
                    e["APS Nowcast"] = +parseFloat(e["APS Nowcast"]).toFixed(6);
                else
                    e["APS Nowcast"] = null;

                if (e["APS Forecast"])
                    e["APS Forecast"] = +parseFloat(e["APS Forecast"]).toFixed(6);
                else
                    e["APS Forecast"] = null;

                if (e["Observations"])
                    e["Observations"] = +parseFloat(e["Observations"]).toFixed(4);
                else
                    e["Observations"] = null;

                if (e["NOAA Tidal Predictions"])
                    e["NOAA Tidal Predictions"] = +parseFloat(e["NOAA Tidal Predictions"]).toFixed(4);
                else
                    e["NOAA Tidal Predictions"] = null;

                if (e["Difference (APS-OBS)"])
                    e["Difference (APS-OBS)"] = +parseFloat(e["Difference (APS-OBS)"]).toFixed(6);
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
        ret_val = dayjs.utc(value).format('MM-DD:HH').split('+')[0] + 'Z';

    // return the formatted value
    return ret_val;
}

/**
 * Creates the chart.
 *
 * @param url
 * @returns {JSX.Element}
 * @constructor
 */
function CreateObsChart(url) {
    // get the settings for the Y-axis min/max values
    const { obsChartY } = useSettings();

    // call to get the data. expect back some information too
    const { status, data } = getObsChartData(url.url);

    // set the default y-axis ticks
    const yaxis_ticks= [-5.0, -4.0, -3.0, -2.0, -1.0, 0.0, 1.0, 2.0, 3.0, 4.0, 5.0];

    // render the chart
    return (
        <ResponsiveContainer width="100%" height="100%">
            { status === 'pending' ? (
                <div>Gathering chart data...</div>
            ) : status === 'error' ? (
                <div>There was a problem with observation data for this location.</div>
            ) : (
                <LineChart data={ data } margin={{ left: -25 }} >
                    <CartesianGrid strokeDasharray="1 1" />

                    <XAxis tick={{ stroke: 'tan', strokeWidth: .5 }} tickSize="10" dataKey="time" tickFormatter={ (value) => formatX_axis(value) }/>

                    <ReferenceLine y={0} stroke="#000000" />
                    <YAxis ticks={ yaxis_ticks } tick={{ stroke: 'tan', strokeWidth: .5 }} tickFormatter={ (value) => formatY_axis(value) } domain={ obsChartY } />

                    <Tooltip />
                    <Legend align="right" />
                    <Line type="monotone" dataKey="Observations" stroke="black" strokeWidth={2} dot={false} isAnimationActive={false} />
                    <Line type="monotone" strokeDasharray="3 1" dataKey="NOAA Tidal Predictions" stroke="teal" strokeWidth={2} dot={false} isAnimationActive={false} />
                    <Line type="monotone" dataKey="APS Nowcast" stroke="CornflowerBlue" strokeWidth={2} dot={false} isAnimationActive={false} />
                    <Line type="monotone" strokeDasharray="4 1 2" dataKey="APS Forecast" stroke="LimeGreen" strokeWidth={2} dot={false} isAnimationActive={false} />
                    <Line type="monotone" dataKey="Difference (APS-OBS)" stroke="red" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
            )}
        </ResponsiveContainer>
    );
}
