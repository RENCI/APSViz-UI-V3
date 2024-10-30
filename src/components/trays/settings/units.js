import React, { useState } from 'react';
import { FormControl, RadioGroup, Radio, Sheet, Typography } from '@mui/joy';
import { useSettings } from '@context';


/**
 * component that handles changing the units of measurement (distance/speed).
 *            <Typography>Select Imperial units (Feet, MPH)</Typography>
 *             <Typography>Distance units (Statue or Nautical)</Typography>
 *
 *             <Typography>Select Metric units (Meters, MPS)</Typography>
 *
 *             <Typography>units</Typography>
 * @returns React.ReactElement
 * @constructor
 */
export const Units = () => {

    const {
        unitsType,
        speedType,
    } = useSettings();

    const [unit, setUnit] = useState(unitsType.current);
    const [speed, setSpeed] = useState(speedType.current);

    const default_speed = {
        metric: "mps",
        imperial: "mph",
    };

    const handleUnitChange = (event) => {
        console.log(event.target.value);
        setUnit(event.target.value);
        unitsType.set(event.target.value);
        // if units type is set to metric - reset speed type to meters/sec
        if (event.target.value === "metric") {
            setSpeed(default_speed.metric);
            speedType.set(default_speed.metric);
        }
        else {
            setSpeed(default_speed.imperial);
            speedType.set(default_speed.imperial);
        }
    };

    const handleSpeedType = (event) => {
        console.log(event.target.value);
        setSpeed(event.target.value);
        speedType.set(event.target.value);
    };

    return (
        <FormControl>
        <RadioGroup
            name="controlled-units-group"
            value={unit}
            onChange={handleUnitChange}
        >
          <Radio value="metric" label="Metric" size="md" />
          <Radio value="imperial" label="Imperial" size="md" />
          {unitsType.current && unitsType.current === "imperial" &&
            <FormControl>
            <Sheet variant="outlined" sx={{ marginTop: 2, boxShadow: 'sm', borderRadius: 'sm', p: 1 }}>
            <Typography level="body-md">Speed units selection:</Typography>
            <RadioGroup
                name="controlled-speed-group"
                value={speed}
                onChange={handleSpeedType}
                orientation="horizontal"
            >
                <Radio value="mph" label="mph" size="md" />
                <Radio value="knots" label="knots" size="md" />
            </RadioGroup>
            </Sheet>
            </FormControl>}
        </RadioGroup>
      </FormControl>
    );
};