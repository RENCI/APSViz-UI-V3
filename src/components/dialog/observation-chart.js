import React, {Fragment} from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from 'axios';
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

/**
 * renders the observations as a chart
 *
 * @param dataUrl
 * @returns {JSX.Element}
 * @constructor
 */
export default function ObservationChart(url) {
    // render the chart
    return (
        <QueryClientProvider client={ queryClient }>
            <CreateObsChart url={ url.url } />
        </QueryClientProvider>
    );
}

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
            const { data } = await axios.get(url);

            // return the csv data in json format
            return csvToJSON(data);
        }
    });
}

/**
 * Creates the chart.
 *
 * @param url
 * @returns {JSX.Element}
 * @constructor
 */
function CreateObsChart(url) {
    // call to get the data. expect back some information too
    const { status, data, error } = getObsChartData(url.url);

    // render the chart
    return (
        <Fragment>
            { status === 'pending' ? (
                'Loading...'
            ) : status === 'error' ? (
                <span>Error: {error.message}</span>
            ) : (
                <LineChart width={590} height={300} data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
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
            )}
        </Fragment>
    );
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
