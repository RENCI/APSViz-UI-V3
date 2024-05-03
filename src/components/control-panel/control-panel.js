import React from 'react';
import { useLayers } from '@context/map-context';
import { Sheet, ButtonGroup, Button, Typography, IconButton, Box, Switch } from '@mui/joy';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import apsLogo from '@images/aps-trans-logo.png';


//import { useLayers } from '@context';

export const ControlPanel = () => {
  //const { defaultModelLayers, toggleLayerVisibility } = useLayers();
  const { defaultModelLayers } = useLayers();
  const layers = [...defaultModelLayers];

  return (
    <>
    <Sheet
        variant="plain"
        sx={{
            position: 'absolute',
            bottom: 0, right: 0,
            overflow: 'hidden',
            p: 0,
            backgroundColor: '#f0f4f820',
            height: '40vh',
            width: '300px',
            zIndex: 999,
            filter: 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.2))',
            borderRadius: 10,

        }}
    >
        <Box
            component="img"
            sx={{height: 64,}}
            alt="ADCIRC Prediction System"
            src={apsLogo}
        />
        { (layers.length) &&
            <p style={{paddingLeft: 30, color: 'white'}}>model run date: {layers[0].properties.run_date}</p>
        }
        <Typography sx={{ paddingLeft: 10, color: "white" }} component="label" endDecorator={<ButtonGroup>
            <IconButton size='small'>
                <ArrowUpward/>
            </IconButton>
            <IconButton size='small'>
                <ArrowDownward/>
            </IconButton>
        </ButtonGroup>}>
            {/* NOTE: If this is a tropical storm run, we need to change cycle to advisoy 
                      Also probabaly want to add a switch for hurricane layers - which
                      involves making a request to the MetGet API */}
            cycle {layers.length && layers[0].properties.cycle}
        </Typography>
        { (layers.length) &&
            <p style={{paddingLeft: 30, color: 'white'}}>{layers[0].properties.grid_type} grid</p>
        }
        <Typography sx={{ paddingLeft: 10, color: "white" }} component="label" endDecorator={<Switch/>}>
            observations
        </Typography>
        <ButtonGroup
            disabled={false}
            orientation="vertical"
            variant="plain"
        >
        { layers.map(layer => {
            if (layer.properties.product_type != "obs")
            return (
                <Button key={layer.properties.id}
                        sx={{ color: "white" }}>
                    {layer.properties.product_type}
                </Button>
            );
        })};
        </ButtonGroup>
    </Sheet>
    </>
  );
};