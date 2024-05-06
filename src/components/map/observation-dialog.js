import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import BaseFloatingDialog from "@utils/base-floating-dialog";
import {useLayers} from "@context";
import ObservationChart from "@utils/observation-chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// define the properties of this component
ObservationDialog.propTypes = {
  obs_data: PropTypes.object
};

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
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        width={500}
                        height={300}
                        data={data}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                    </LineChart>
                </ResponsiveContainer>
                {/*<ObservationChart {...args} />*/}
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