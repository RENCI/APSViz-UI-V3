import React, { useEffect } from 'react';
import { useLayers } from '@context/map-context';
import { Sheet, ButtonGroup, Typography, IconButton, Box, Switch, ToggleButtonGroup } from '@mui/joy';
import { KeyboardArrowLeft, KeyboardArrowRight, Tsunami, Water, Air } from '@mui/icons-material';
import apsLogo from '@images/aps-trans-logo.png';


export const ControlPanel = () => {

  const { map, defaultModelLayers, toggleLayerVisibility } = useLayers();

  const layers = [...defaultModelLayers];
  const maxele_layer = layers.find((layer) => layer.properties.product_type === "maxele63");
  const obs_layer = layers.find((layer) => layer.properties.product_type === "obs");

  // keep track of which model run to retrieve
  let runCycle = 0;
  let runDate = new Date();

  const [value, setValue] = React.useState('maxele63');
  const [checked, setChecked] = React.useState(true);

  useEffect(() => {
    if (layers[0]) {
        // set the initial run cycle
        runCycle = parseInt(layers[0].properties.cycle);

        // set the initial run date string
        const dateParts = layers[0].properties.run_date.split('-');
        const currentDate = new Date(dateParts[0], dateParts[1]-1, dateParts[2]);
        runDate = new Date(currentDate) 
    }

  }, [layers]);

  const layerChange = (event, newValue) => {

    setValue(newValue);
     // turn off the old
     layers.map(layer => {
        if (layer.layers.includes(value)) {
            toggleLayerVisibility(layer.id);
        }
    }); 
    // turn on the new
    layers.map(layer => {
        if (layer.layers.includes(newValue)) {
            toggleLayerVisibility(layer.id);
        }
    });
  };

  const toggleObsLayer = (event) => {
    setChecked(event.target.checked);
    toggleLayerVisibility(obs_layer.id);
  };

  const changeModelRun = async (e) => {
    const data_url = `${process.env.REACT_APP_UI_DATA_URL}get_ui_data_secure?limit=1&use_new_wb=true&use_v3_sp=true`;
    const direction = e.currentTarget.getAttribute("button-key");

    // TODO: Need to update this to also support tropical storms
  
    // get the run details
    if (layers) {
        const runId = layers[0].id.split('-')[0];
        const metClass = layers[0].properties.met_class;
        const eventType = layers[0].properties.event_type;

        if (direction === "next") {
            // set properties for next model run
            if (runCycle === 18) { // need to push date to next day
                runDate.setDate(runDate.getDate() + 1);
                runCycle = 0;
            } else {
                runCycle += 6;
            }
        } else {  // previous
            // set properties for previous model run
            if (runCycle === 0) { // need to push date to previous day
                runDate.setDate(runDate.getDate() - 1);
                runCycle = 18;
            } else {
                runCycle -= 6;
            }
        }

        // now do the api query to retrieve the data
        // here are the query parameters
        console.log("query params:");
        console.log(runId);
        console.log(metClass);
        console.log(eventType);
        console.log(runDate.toDateString());
        console.log(runCycle);
    }
  };

  return (
    <>
    <Sheet
        variant="plain"
        sx={{
            position: 'absolute',
            bottom: 0, right: 0,
            overflow: 'hidden',
            p: 0,
            backgroundColor: '#f0f4f800',
            height: '30vh',
            width: '300px',
            zIndex: 999,
            filter: 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.2))',
            borderRadius: 10,
            display: 'flex',
            flexDirection: 'column',
        }}
    >
        <Box
            component="img"
            sx={{height: 70, paddingBottom: 1, alignSelf: 'center'}}
            alt="ADCIRC Prediction System"
            src={apsLogo}
        />
        { (layers.length) &&
            <Typography level='h4' sx={{paddingLeft: 3, color: 'white'}}>model run date: {layers[0].properties.run_date}</Typography>
        }
        <Box sx={{display: 'flex', alignItems: 'center', gap: 1, marginLeft: 7}}>
            <IconButton variant="outlined" button-key='previous' onClick={changeModelRun}>
                <KeyboardArrowLeft/>
            </IconButton>
            <Typography level='h4' sx={{ color: "white" }}>cycle {layers.length && layers[0].properties.cycle}</Typography>
            <IconButton variant="outlined" button-key='next' onClick={changeModelRun}>
                <KeyboardArrowRight/>
            </IconButton>
        </Box>
        {/* TODO:  NOTE: If this is a tropical storm run, we need to change cycle to advisoy 
                    Also probabaly want to add a switch for hurricane layers - which
                    involves making a request to the MetGet API 
                    Third need to implement actual code to load different model runs each time 
                    up/down arrows are clicked. This has to time managed in some way so that
                    Geoserver is not inundated with requests */}
        { (layers.length) &&
            <Typography level='h5' sx={{ paddingLeft: 7, paddingTop: 1, color: 'white'}}>{layers[0].properties.grid_type} grid</Typography>
        }
        <Typography sx={{ paddingLeft: 9, paddingTop: 1, color: "white" }} component="label" endDecorator={
            <Switch checked={checked} onChange={toggleObsLayer}>
        </Switch>}>
            observations
        </Typography>
        {<Typography sx={{ paddingLeft: 9, paddingTop: 1, color: "white" }} component="label" endDecorator={<ToggleButtonGroup
                    value={value}
                    orientation="horizontal"
                    variant="solid"
                    color="primary"
                    onChange={layerChange}

                // have to do wierd stuff to get maxele first and default button
            >   { (maxele_layer)  &&
                    <IconButton value={maxele_layer.properties.product_type} key={maxele_layer.properties.id}>
                        <Water/>
                    </IconButton>
                }
                { layers.map(layer => {
                    if (layer.properties.product_type != "obs" && layer.properties.product_type != "maxele63")
                        
                        return (
                            <IconButton value={layer.properties.product_type} key={layer.properties.id}>
                                { (layer.properties.product_type === "maxwvel63") &&
                                <Air/>}
                                {(layer.properties.product_type === "swan_HS_max63") &&
                                <Tsunami/>}
                            </IconButton>
                        );
                })}
            </ToggleButtonGroup>}>
        </Typography>}
    </Sheet>
    </>
  );
};