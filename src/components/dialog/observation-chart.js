import React, {Fragment} from 'react';
import { useQuery } from '@tanstack/react-query';
import { Typography } from '@mui/material';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, ReferenceLine } from 'recharts';
import {feetToMeters, metersToFeet, getNamespacedEnvParam} from "@utils/map-utils";
import dayjs from 'dayjs';
import { useSettings } from '@context';

// install day.js for UTC visual formatting
const utc = require("dayjs/plugin/utc");

// init the date formatter to use UTC only
dayjs.extend(utc);

/**
 * renders the observations as a chart
 *
 * @param chartProps
 * @returns React.ReactElement
 * @constructor
 */
export default function ObservationChart(chartProps) {
    // render the chart
    return (<CreateObsChart chartProps={chartProps}/>);
}

/**
 * this captures the re-chart deprecation warnings on the chart rendering.
 *
 * @type {{(message?: any, ...optionalParams: any[]): void, (...data: any[]): void}}
 */
const error = console.error;
console.error = (...args) => {
    if (/defaultProps/.test(args[0])) return;
    error(...args);
};

/**
 * Retrieves and returns the chart data in JSON format
 *
 * @param url
 * @param setLineButtonView
 * @returns { [json] || '' }
 */
function getObsChartData(url, setLineButtonView) {
    // configure the retry count to be zero
    axiosRetry(axios, {
        retries: 0
    });

    // return the data to the caller
    return useQuery({
        // specify the data key and url to use
        queryKey: ['apsviz-data', url],

        // create the function to call for data
        queryFn: async () => {
            // create the authorization header
            const requestOptions = {
                method: 'GET',
                headers: {Authorization: `Bearer ${getNamespacedEnvParam('REACT_APP_UI_DATA_TOKEN')}`}
            };

            // make the call to get the data
            const ret_val = await axios.get(url, requestOptions)
                // use the data returned
                .then((response) => { return response.data; })
                // otherwise capture the error
                .catch((error) => { return error.response.status; });

            // if there was not an error
            if (ret_val !== 500)
                // return the csv data in JSON format
                return csvToJSON(ret_val, setLineButtonView);
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
 * @param setLineButtonView
 * @returns { json [] }
 */
const csvToJSON = (csvData, setLineButtonView) => {
    // ensure that there is csv data to convert
    if (csvData !== "") {
        // split on carriage returns. also removing all the windows "\r" characters when they exist
        const lines = csvData.replaceAll('\r', '').split('\n');

        // init the result
        const ret_val = [];

        // get the first line (data header)
        const dataHeader = lines[0].split(",");

        // loop through the rest of the data
        for (let i = 1; i < lines.length; i++) {
            // split the line on commas
            const currentLine = lines[i].split(",");

            // init storage for the processed data
            const jsonObj = {};

            // loop through the data and get name/value pairs in JSON format
            for (let j = 0; j < dataHeader.length; j++) {
                // save the data
                jsonObj[dataHeader[j]] = currentLine[j];
            }

            // make sure there is a good record (has a timestamp)
            if (jsonObj.time.length) {
                // add these so the "units" converter will initially format the data properly
                jsonObj['useUTC'] = null;
                jsonObj['units'] = null;

                // add the data to the return
                ret_val.push(jsonObj);
            }
        }

        // set the chart line toggle and get undefined data formatted for the chart rendering
        ret_val.forEach( function (chartItem) {
            // loop through the keys
            Object.keys(chartItem).forEach(function (key) {
                // if there is a value for the key
                if (chartItem[key])
                    setLineButtonView(key);
                // undefined data gets set to null for proper chart rendering
                else
                    chartItem[key] = null;
            });
        });

        // return the data
        return ret_val;
    }
};

/**
 * reformats the data based on user selections for the timezone and units of measurement.
 *
 * note: this method modifies the data in-place.
 *
 * @param data
 * @param newUnits
 * @param useUTC
 */
const getReformattedData = (data, newUnits, useUTC) => {
    // if there is data to process
    if (data !== undefined && data.length) {
        // loop through each chart data item
        data.forEach( function (chartItem) {
            // loop through all the keys and change the format if needed
            Object.keys(chartItem).forEach(function(key){
                // check for timezone conversion on the time element
                if (key === 'time') {
                    // convert the date/time to UTC format
                    if (useUTC) {
                        // get the date/time in ISO format
                        const newTime = new Date(chartItem[key]).toISOString();

                        // reformat the date/time into the new format
                        chartItem[key] = newTime.replace('T', ' ')
                            .substring(0, newTime.split(':', 2) .join(':').length) + 'Z';
                    }
                    // convert the date/time to local timezone
                    else {
                        // reformat the date/time to the local timezone
                        chartItem[key] = new Date(chartItem[key]).toLocaleString();
                    }
                }
                // check for measurement units conversion
                else if (newUnits !== chartItem['units']) {
                    // if the data element is null, it stays null
                    if (chartItem[key] !== null) {
                        // convert the value to the new measurement units
                        chartItem[key] = (newUnits === 'imperial') ? +parseFloat(metersToFeet(chartItem[key])).toFixed(3) :
                            +parseFloat(feetToMeters(chartItem[key])).toFixed(3);
                    }
                }
            });

            // save the new timezone and measurement unit types
            chartItem['useUTC'] = useUTC;
            chartItem['units'] = newUnits;
        });
    }
};

/**
 * reformats the data label shown on the y-axis
 *
 * @param value
 * @returns {string}
 */
function formatY_axis(value) {
    // return the formatted value
    return value.toFixed(1);
}

/**
 * reformats the data label shown on the x-axis. this uses the chosen timezone.
 *
 * @param value
 * @param useUTC
 * @returns {string}
 */
function formatX_axis(value, useUTC) {
    // init the return value
    let ret_val = "";

    // empty data will be ignored
    if (value !== "")
        // put this in the proper format
        if (useUTC)
            ret_val = dayjs.utc(value).format('MM/DD-HH').split('+')[0] + 'Z';
        // else use reformat using the local time zone
        else
            ret_val = dayjs(value).format('MM/DD-HH').split('+')[0];

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
                .filter(function (o) {
                    return !(o[aKey] === undefined || o[aKey] === null);
                })
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

        // create an array of tick marks based on the max data value
        for (let i = -maxVal; i <= maxVal; i += .5)
            ret_val.push(i);

        // return the new y-axis array range
        return ret_val;
    }
}

/**
 * gets the x-axis label interval count based on the data
 *
 * @param data
 * @returns {number}
 */
function get_xtick_interval(data) {
    //time resolution in minutes
    const dt = Math.abs((new Date(data[0].time) - new Date(data[1].time))) / (1000 * 60);

    // data length in "days"
    const days = (data.length - 1) * dt / 24 / 60;

    // get the number of data elements per hour
    const one_hour_interval = 60 / dt;

    // default to daily
    let interval = one_hour_interval * 24 - 1;

    // all ticks for <= 0.5 days>
    if (days <= 0.5)
        interval = 0;
    // hour labels for <= 1.5 days
    else if (days <= 1.5)
        interval = one_hour_interval - 1;
    // 6-hour labels for <= 4.5 days
    else if (days <= 4.5)
        interval = one_hour_interval * 6 - 1;
    // 12-hour labels for <= 7.5 days
    else if (days <= 7.5)
        interval = one_hour_interval * 12 - 1;

    // return the calculated interval
    return interval;
}

/**
 * Creates the chart.
 *
 * @param c: the chart props
 * @returns React.ReactElement
 * @constructor
 */
const CreateObsChart = (c) => {
    // get the timezone preference
    const { useUTC, unitsType } = useSettings();

    // set the "units" label
    const unitLabel = (unitsType.current === "imperial") ? "ft" : "m";

    // call to get the data. expect back some information too
    const {status, data} = getObsChartData(c.chartProps.url, c.chartProps.setLineButtonView);

    // reformat the data to the desired time zone and units of measurement
    getReformattedData(data, unitsType.current, useUTC.enabled);

    // render the chart
    return (
        <Fragment>
            {
                status === 'pending' ? (<Typography sx={{alignItems: 'center', fontSize: 12}}>Gathering chart data...</Typography>) :
                    (status === 'error' || data === '') ? (
                        <Typography sx={{alignItems: 'center', color: 'red', fontSize: 12}}>
                            There was a problem collecting data for this location.
                        </Typography>) :
                        <ResponsiveContainer>
                            <LineChart margin={{top: 5, right: 10, left: -25, bottom: 5}} data={data} isHide={c.chartProps.isHideLine}>
                                <CartesianGrid strokeDasharray="1 1"/>

                                <XAxis interval={get_xtick_interval(data)} angle={-90} height={55} tickMargin={27}
                                       tick={{stroke: 'tan', strokeWidth: .5}} dataKey="time" tickFormatter={(value) => formatX_axis(value, useUTC.enabled)}/>

                                <ReferenceLine y={0} stroke="Black" strokeDasharray="3 3"/>

                                <YAxis unit={unitLabel} ticks={get_yaxis_ticks(data)} tick={{stroke: 'tan', strokeWidth: .5}}
                                       tickFormatter={(value) => formatY_axis(value)}/>

                                <Tooltip/>

                                <Line unit={unitLabel} type="monotone" dataKey="Observations" stroke="black" strokeWidth={1} dot={false}
                                      isAnimationActive={false} hide={c.chartProps.isHideLine['Observations']}/>
                                <Line unit={unitLabel} type="monotone" dataKey="NOAA Tidal Predictions" stroke="teal" strokeWidth={1} dot={false}
                                      isAnimationActive={false} hide={c.chartProps.isHideLine["NOAA Tidal Predictions"]}/>
                                <Line unit={unitLabel} type="monotone" dataKey="APS Nowcast" stroke="CornflowerBlue" strokeWidth={2} dot={false}
                                      isAnimationActive={false} hide={c.chartProps.isHideLine["APS Nowcast"]}/>
                                <Line unit={unitLabel} type="monotone" dataKey="APS Forecast" stroke="LimeGreen" strokeWidth={2} dot={false}
                                      isAnimationActive={false} hide={c.chartProps.isHideLine["APS Forecast"]}/>
                                <Line unit={unitLabel} type="monotone" dataKey="SWAN Nowcast" stroke="CornflowerBlue" strokeWidth={2} dot={false}
                                      isAnimationActive={false} hide={c.chartProps.isHideLine["SWAN Nowcast"]}/>
                                <Line unit={unitLabel} type="monotone" dataKey="SWAN Forecast" stroke="LimeGreen" strokeWidth={2} dot={false}
                                      isAnimationActive={false} hide={c.chartProps.isHideLine["SWAN Forecast"]}/>
                                <Line unit={unitLabel} type="monotone" dataKey="Difference (APS-OBS)" stroke="red" strokeWidth={1} dot={false}
                                      isAnimationActive={false} hide={c.chartProps.isHideLine["Difference (APS-OBS)"]}/>
                            </LineChart>
                        </ResponsiveContainer>
            }
        </Fragment>
    );
};
