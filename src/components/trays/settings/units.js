import React, { useState } from 'react';
import { FormControl, RadioGroup, Radio, Sheet, Typography } from '@mui/joy';
import { useSettings } from '@context';
import { maxeleStyle, maxeleImperialStyle,
         maxwvelStyle, maxwvelImperialMPHStyle, maxwvelImperialKnotsStyle,
         swanStyle, swanImperialStyle } from '@utils';


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
        mapStyle,
        unitsType,
        speedType,
    } = useSettings();

    const [unit, setUnit] = useState(unitsType.current);
    const [speed, setSpeed] = useState(speedType.current);

    const default_speed = {
        metric: "mps",
        imperial: "mph",
    };

    const setLayerStyles = (unitType) => {
        if (unitType === "metric") {
            mapStyle.maxele.set(maxeleStyle);
            mapStyle.swan.set(swanStyle);
            mapStyle.maxwvel.set(maxwvelStyle);
        }
        else {
            mapStyle.maxele.set(maxeleImperialStyle);
            mapStyle.swan.set(swanImperialStyle);
            mapStyle.maxwvel.set(maxwvelImperialMPHStyle);
        }
    };

    const handleUnitChange = (event) => {
        const unitType = event.target.value;
        console.log(unitType);
        setUnit(unitType);
        unitsType.set(unitType);
        // if units type is set to metric - reset speed type to meters/sec
        if (unitType === "metric") {
            setSpeed(default_speed.metric);
            speedType.set(default_speed.metric);
        }
        else {
            setSpeed(default_speed.imperial);
            speedType.set(default_speed.imperial);
        }
        setLayerStyles(unitType);
    };

    const handleSpeedType = (event) => {
        const stype = event.target.value;
        console.log(stype);
        setSpeed(stype);
        speedType.set(stype);
        if (stype === "mph") {
            mapStyle.maxwvel.set(maxwvelImperialMPHStyle);
        }
        else {
            mapStyle.maxwvel.set(maxwvelImperialKnotsStyle);
        }
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