import React, { Fragment } from 'react';
import { IconButton, Stack, Typography, Slider, Box } from '@mui/joy';
import { useSettings } from '@context';
import LineAxisRoundedIcon from '@mui/icons-material/LineAxisRounded';

/**
 * renders the observation chart Y-axis slider
 *
 * @returns {JSX.Element}
 * @constructor
 */
export const ObsChartYAxis = () => {
    // get the settings for the obs chart Y-axis min/max values
    const { obsChartY, setObsChartY } = useSettings();

    // capture the slider values
    const handleChange = (event, newValue) => {
        // save the value to state
        setObsChartY(newValue);
    };

    // mark the line
    const marks = [ { value: -20 }, { value: -10 }, { value: 0 }, { value: 10 }, { value: 20 } ];

    // render the control
    return (
        <Stack
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
            gap={2}
        >
            <YAxisSlider/>

            <div>
                <Typography level="title-md">Observation chart Y-axis [{ obsChartY.map(x => x).join(' -> ') }]</Typography>

                <Box width={400} >
                    <Slider
                        getAriaLabel={() => 'Y-Axis'}
                        value={ obsChartY }
                        defaultValue={ obsChartY }
                        onChange={ handleChange }
                        valueLabelDisplay="auto"
                        step={ 0.5 }
                        marks={ marks }
                        min={-20}
                        max={20}
                        disableSwap
                        sx={{
                            "--Slider-thumbWidth": "8px",
                            "--Slider-valueLabelArrowSize": "-1px",
                            "--Slider-trackSize": "3px",
                            "--Slider-markSize": "3px"
                        }}
                    />
                </Box>
            </div>
        </Stack>
    );
};

/**
 * renders the icon
 *
 * @returns {JSX.Element}
 * @constructor
 */
export const YAxisSlider = () => {
    // render the control
    return (
        <Fragment>
            <IconButton id="chart-y-axis-slider" size="lg" variant="outlined" >
                <LineAxisRoundedIcon />
            </IconButton>
        </Fragment>);
};
