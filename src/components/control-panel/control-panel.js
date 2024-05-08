import React from 'react';
import { useLayers } from '@context/map-context';
import { Sheet, ButtonGroup, Typography, IconButton, Box, Switch, ToggleButtonGroup } from '@mui/joy';
import { ArrowUpward, ArrowDownward, Tsunami, Water, Air } from '@mui/icons-material';
import apsLogo from '@images/aps-trans-logo.png';


export const ControlPanel = () => {
  //const { defaultModelLayers, toggleLayerVisibility } = useLayers();
  const { defaultModelLayers, toggleLayerVisibility } = useLayers();

  const layers = [...defaultModelLayers];
  const maxele_layer = layers.find((layer) => layer.properties.product_type === "maxele63");
  const obs_layer = layers.find((layer) => layer.properties.product_type === "obs");

  const [value, setValue] = React.useState('maxele63');
  const [checked, setChecked] = React.useState(true);

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
            console.log(newValue);
            toggleLayerVisibility(layer.id);
        }
    });
  };

  const toggleObsLayer = (event) => {
    setChecked(event.target.checked);
    toggleLayerVisibility(obs_layer.id);
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
        <Typography level='h4' sx={{ paddingLeft: 10, color: "white" }} component="label" endDecorator={<ButtonGroup>
            <IconButton size='small' key='up'>
                <ArrowUpward/>
            </IconButton>
            <IconButton size='small' key='down'>
                <ArrowDownward/>
            </IconButton>
            </ButtonGroup>}>
            {/* TODO:  NOTE: If this is a tropical storm run, we need to change cycle to advisoy 
                      Also probabaly want to add a switch for hurricane layers - which
                      involves making a request to the MetGet API 
                      Third need to implement actual code to load different model runs each time 
                      up/down arrows are clicked. This has to time managed in some way so that
                      Geoserver is not inundated with requests */}
                cycle {layers.length && layers[0].properties.cycle}
        </Typography>
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